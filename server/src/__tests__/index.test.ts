import { jest, describe, it, expect, beforeEach, afterEach } from "@jest/globals";

// Create mockExpressInstance outside mock definition for reference in tests
const mockJson = jest.fn().mockReturnValue("mockedJsonMiddleware");
const mockExpressInstance = {
  use: jest.fn(),
  listen: jest.fn((port: number, callback: () => void) => {
    callback?.();
    return { on: jest.fn() };
  }),
};

// Base mocks that don't change
jest.mock("express", () => {
  const mockExpress = jest.fn(() => mockExpressInstance);
  return Object.assign(mockExpress, { json: mockJson });
});

jest.mock("cors", () =>
  jest.fn().mockImplementation(() => "mockedCorsMiddleware")
);

jest.mock("../config/db", () => ({
  connectDB: jest.fn().mockImplementation(() => Promise.resolve()),
}));

jest.mock("../schemas/leftoverSchema", () => "mockTypeDefs");
jest.mock("../resolvers/leftoverResolvers", () => "mockResolvers");

jest.mock("../config/env", () => ({
  PORT: 4000,
  NODE_ENV: "test",
  CORS_ORIGIN: "http://localhost:3000",
  GRAPHQL_PATH: "/graphql",
  isProd: false,
}));

// Mock ApolloServer separately as it needs different implementations per test
jest.mock("@apollo/server", () => ({
  ApolloServer: jest.fn(),
}));

// Mock expressMiddleware
jest.mock("@apollo/server/express4", () => ({
  expressMiddleware: jest.fn().mockReturnValue("mockedApolloMiddleware"),
}));

describe("Server initialization", () => {
  let consoleLogSpy: ReturnType<typeof jest.spyOn>;
  let consoleErrorSpy: ReturnType<typeof jest.spyOn>;
  const { ApolloServer } = require("@apollo/server");
  const { expressMiddleware } = require("@apollo/server/express4");

  beforeEach(() => {
    jest.clearAllMocks();
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // Reset ApolloServer mock for each test
    ApolloServer.mockReset();
    expressMiddleware.mockClear();
    mockExpressInstance.use.mockClear();
    mockExpressInstance.listen.mockClear();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    jest.resetModules();
  });

  it("should initialize the server with all components", async () => {
    // Set up success mock for this test
    ApolloServer.mockImplementation(() => ({
      start: jest.fn().mockImplementation(() => Promise.resolve()),
    }));

    const { connectDB } = require("../config/db");

    await import("../index");

    // Verify database connection
    expect(connectDB).toHaveBeenCalled();

    // Check all use calls - don't test exact ordering or parameters
    // Just verify that the middleware functions were used
    expect(mockExpressInstance.use).toHaveBeenCalled();
    expect(mockJson).toHaveBeenCalled();

    // Verify Apollo Server setup
    expect(ApolloServer).toHaveBeenCalledWith({
      typeDefs: ["mockTypeDefs"],
      resolvers: ["mockResolvers"],
    });

    const mockApolloServer = ApolloServer.mock.results[0].value;
    expect(mockApolloServer.start).toHaveBeenCalled();

    // Verify expressMiddleware was called with server and context
    expect(expressMiddleware).toHaveBeenCalledWith(
      mockApolloServer,
      expect.objectContaining({
        context: expect.any(Function),
      })
    );

    // Verify that the GraphQL middleware route was set up
    // This checks that at some point, app.use was called with the GraphQL path
    const graphqlMiddlewareCall = mockExpressInstance.use.mock.calls.find(
      call => call[0] === "/graphql"
    );
    expect(graphqlMiddlewareCall).toBeDefined();

    // Verify server start
    expect(mockExpressInstance.listen).toHaveBeenCalledWith(4000, expect.any(Function));
  });

  it("should handle server startup errors", async () => {
    // Reset modules and mocks
    jest.resetModules();
    ApolloServer.mockReset();

    // Set up ApolloServer mock implementation before importing the module
    ApolloServer.mockImplementation(() => ({
      start: (): Promise<void> => Promise.reject(new Error("Server start failed")),
    }));

    // Import the module under test
    await import("../index");

    // Verify error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error starting server:",
      expect.any(Error)
    );
  });

  it("should log CORS information in non-production environment", async () => {
    // Set up success mock for this test
    ApolloServer.mockImplementation(() => ({
      start: jest.fn().mockImplementation(() => Promise.resolve()),
    }));

    await import("../index");

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "CORS configuration:",
      expect.objectContaining({
        origins: "http://localhost:3000",
        credentials: true,
      })
    );
  });
});
