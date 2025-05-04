/**
 * Main server entry point
 * Sets up Express with Apollo GraphQL server and configures middleware
 */
import express from "express";
import { ApolloServer } from "apollo-server-express";
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
async function startServer() {
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

  await server.start();

  /**
   * Mount Apollo middleware on Express
   * Using path from configuration and disabling Apollo's CORS
   * in favor of the Express CORS middleware
   */
  server.applyMiddleware({
    app: app as any,
    path: env.GRAPHQL_PATH,
    cors: false, // Express already handles CORS
  });

  // Start HTTP server and log connection information
  app.listen(env.PORT, () => {
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
}

// Handle any startup errors gracefully
startServer().catch((error) => console.error("Error starting server:", error));
