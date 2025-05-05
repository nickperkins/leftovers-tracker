/**
 * Main server entry point
 * Sets up Express with Apollo GraphQL server and configures middleware
 */
import express from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { connectDB } from "./config/db";
import leftoverTypeDefs from "./schemas/leftoverSchema";
import leftoverResolvers from "./resolvers/leftoverResolvers";
import env from "./config/env";

// Initialize database before server startup to ensure connectivity
connectDB();

/**
 * Configures and starts the Express/Apollo server
 * - Sets up CORS security for cross-origin requests
 * - Configures GraphQL with schema and resolvers
 * - Starts HTTP listener on configured port
 */
export async function startServer() {
  const app = express();

  /**
   * CORS configuration with security considerations:
   * - Restricts origins based on environment settings
   * - Enables credentials for authenticated requests
   * - Limits allowed HTTP methods and headers
   */
  const corsOptions = {
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  // Enhanced debugging information for development environments
  if (!env.isProd) {
    console.log("CORS configuration:", {
      origins: env.CORS_ORIGIN,
      credentials: true,
    });
  }

  // Apply essential middleware
  app.use(cors(corsOptions));
  app.use(express.json());

  // Initialize Apollo with schema components
  const server = new ApolloServer({
    typeDefs: [leftoverTypeDefs],
    resolvers: [leftoverResolvers],
  });

  // Start the Apollo server before applying middleware
  await server.start();

  // Apply GraphQL middleware with proper typing
  app.use(
    env.GRAPHQL_PATH,
    cors(corsOptions),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ req }),
    }) as express.RequestHandler
  );

  // Start HTTP server and log connection information
  const httpServer = app.listen(env.PORT, () => {
    console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    console.log(
      `GraphQL endpoint: http://localhost:${env.PORT}${env.GRAPHQL_PATH}`
    );

    // Provide detailed connection help in development environments
    if (!env.isProd) {
      console.log(`
        🌐 CORS Info:
        - Server URL: http://localhost:${env.PORT}${env.GRAPHQL_PATH}
        - Client should connect from: ${
          Array.isArray(env.CORS_ORIGIN)
            ? env.CORS_ORIGIN.join(", ")
            : env.CORS_ORIGIN
        }
        - Make sure your client is connecting to http://localhost:${env.PORT}${
        env.GRAPHQL_PATH
      }
      `);
    }
  });

  return {
    server,
    httpServer,
    app,
    port: env.PORT
  };
}

/**
 * Gracefully shuts down the server and related resources
 * Ensures all connections are properly closed
 */
export async function stopServer(serverInfo: { 
  server: ApolloServer, 
  httpServer: http.Server,
  app?: express.Application
}) {
  try {
    const { server, httpServer } = serverInfo;
    
    // Stop Apollo server
    if (server) {
      await server.stop();
      console.log('Apollo server stopped');
    }
    
    // Close HTTP server
    if (httpServer && httpServer.listening) {
      await new Promise<void>((resolve, reject) => {
        httpServer.close((err: Error | undefined) => {
          if (err) {
            console.error('Error closing HTTP server:', err);
            reject(err);
          } else {
            console.log('HTTP server closed');
            resolve();
          }
        });
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error during server shutdown:', error);
    return false;
  }
}

// Handle any startup errors gracefully
if (require.main === module) {
  startServer().catch((error) => console.error("Error starting server:", error));
}
