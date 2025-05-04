import { expect, describe, it, afterAll } from "@jest/globals";
import { sequelize, connectDB } from "../../config/db";
import { QueryTypes } from "sequelize";

describe("Database Configuration", () => {
  afterAll(async () => {
    await sequelize.close();
  });

  it("should connect to the database successfully", async () => {
    await expect(connectDB()).resolves.not.toThrow();
  });

  it("should authenticate successfully", async () => {
    await expect(sequelize.authenticate()).resolves.not.toThrow();
  });

  it("should create tables on sync", async () => {
    await sequelize.sync({ force: true });
    const tables = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table'",
      { type: QueryTypes.SELECT }
    );
    expect(tables).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "leftovers" })])
    );
  });

  it("should use SQLite dialect", () => {
    expect(sequelize.getDialect()).toBe("sqlite");
  });
});
