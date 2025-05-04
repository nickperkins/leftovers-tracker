/**
 * Client-side environment configuration
 *
 * Centralizes environment variables with proper typing and intelligent defaults
 * When using Vite, environment variables must be prefixed with VITE_
 */

// Type definition for environment configuration
interface EnvConfig {
  API_URL: string;
  GRAPHQL_ENDPOINT: string;
  NODE_ENV: string;
  isProd: boolean;
  isDev: boolean;
}

/**
 * Determines API URL based on environment
 * - Uses VITE_API_URL if provided
 * - Falls back to development URL in dev mode
 * - Uses same-origin in production for better security
 */
const getApiUrl = (): string => {
  const devApiUrl = "http://localhost:4000";

  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || devApiUrl;
  }

  return import.meta.env.VITE_API_URL || window.location.origin;
};

/**
 * Builds the complete GraphQL endpoint URL
 * Combines API URL with configured GraphQL path
 */
const getGraphQLEndpoint = (): string => {
  const apiUrl = getApiUrl();
  const graphqlPath = import.meta.env.VITE_GRAPHQL_PATH || "/graphql";

  return `${apiUrl}${graphqlPath}`;
};

// Export environment configuration
export const env: EnvConfig = {
  API_URL: getApiUrl(),
  GRAPHQL_ENDPOINT: getGraphQLEndpoint(),
  NODE_ENV: import.meta.env.MODE,
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
};

export default env;
