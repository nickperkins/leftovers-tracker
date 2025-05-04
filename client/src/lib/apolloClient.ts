import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import env from "./env";

/**
 * GraphQL HTTP connection configuration
 * Uses environment-based endpoint with appropriate credential handling
 */
const httpLink = createHttpLink({
  uri: env.GRAPHQL_ENDPOINT,
  credentials: env.isProd ? "include" : "same-origin", // More secure in production
});

/**
 * Apollo client instance with optimized caching strategy
 * - Uses cache-and-network for fresh data with offline support
 * - Dev tools enabled only in development environment
 */
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
  connectToDevTools: env.isDev,
});

export default client;
