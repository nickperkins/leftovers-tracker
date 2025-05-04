import {
  expect,
  describe,
  it,
  beforeEach,
  afterAll,
  jest,
} from "@jest/globals";
import env from "../../config/env";

describe("Environment Configuration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should use default values when environment variables are not set", () => {
    delete process.env.PORT;
    delete process.env.NODE_ENV;
    delete process.env.DB_PATH;
    delete process.env.CORS_ORIGIN;
    delete process.env.GRAPHQL_PATH;

    expect(env.PORT).toBe(4000);
    expect(env.NODE_ENV).toBe("development");
    expect(env.DB_PATH).toBeDefined();
    expect(env.CORS_ORIGIN).toBe("*");
    expect(env.GRAPHQL_PATH).toBe("/graphql");
  });

  it("should use environment variables when set", () => {
    process.env.PORT = "5000";
    process.env.NODE_ENV = "production";
    process.env.DB_PATH = "/custom/path/db.sqlite";
    process.env.CORS_ORIGIN = "https://example.com";
    process.env.GRAPHQL_PATH = "/api/graphql";

    const newEnv = require("../../config/env").default;

    expect(newEnv.PORT).toBe(5000);
    expect(newEnv.NODE_ENV).toBe("production");
    expect(newEnv.DB_PATH).toBe("/custom/path/db.sqlite");
    expect(newEnv.CORS_ORIGIN).toBe("https://example.com");
    expect(newEnv.GRAPHQL_PATH).toBe("/api/graphql");
  });

  it("should parse multiple CORS origins correctly", () => {
    process.env.CORS_ORIGIN = "https://example.com,https://api.example.com";
    const newEnv = require("../../config/env").default;

    expect(Array.isArray(newEnv.CORS_ORIGIN)).toBe(true);
    expect(newEnv.CORS_ORIGIN).toEqual([
      "https://example.com",
      "https://api.example.com",
    ]);
  });

  it("should set isProd based on NODE_ENV", () => {
    process.env.NODE_ENV = "production";
    const prodEnv = require("../../config/env").default;
    expect(prodEnv.isProd).toBe(true);

    process.env.NODE_ENV = "development";
    const devEnv = require("../../config/env").default;
    expect(devEnv.isProd).toBe(false);
  });
});
