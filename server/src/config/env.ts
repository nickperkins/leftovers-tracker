/**
 * Environment configuration
 * Centralizes all environment variables with robust defaults and type safety
 */

import dotenv from "dotenv";
dotenv.config();

/**
 * Parses comma-separated origin strings into appropriate format for CORS
 * Returns a string array for multiple origins or a single string
 */
const parseOrigins = (origins: string | undefined): string | string[] => {
  if (!origins) return "*";
  if (origins === "*") return "*";

  const originList = origins.split(",").map((origin) => origin.trim());
  return originList.length > 1 ? originList : originList[0];
};

const env = {
  // Server configuration
  PORT: parseInt(process.env.PORT || "4000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database
  DB_PATH: process.env.SQLITE_PATH || process.env.DB_PATH || "database.sqlite",

  // CORS settings - use what's in the .env file with fallback to wildcard
  CORS_ORIGIN: parseOrigins(process.env.CORS_ORIGIN) || "*",

  // GraphQL path
  GRAPHQL_PATH: process.env.GRAPHQL_PATH || "/graphql",

  // Determine if we're in production
  isProd: process.env.NODE_ENV === "production",

  // Logging
  LOG_LEVEL:
    process.env.LOG_LEVEL ||
    (process.env.NODE_ENV === "production" ? "info" : "debug"),
};

export default env;
