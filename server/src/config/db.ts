import { Sequelize } from "sequelize";
import path from "path";
import env from "./env";

/**
 * Database path configuration with environment variable support
 * Falls back to a local path if not specified in environment
 */
const dbPath = env.DB_PATH || path.join(__dirname, "../../database.sqlite");

/**
 * Sequelize ORM instance for SQLite
 * Logging enabled only in development mode
 */
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: env.NODE_ENV === "development" ? console.log : false,
});

/**
 * Database connection function
 * - Tests the connection
 * - Syncs models with the database
 * - Uses alter mode in development for schema evolution
 */
const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("SQLite connection has been established successfully.");

    await sequelize.sync({ alter: env.NODE_ENV === "development" });
    console.log("Database & tables synced");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

export { sequelize, connectDB };
export default connectDB;
