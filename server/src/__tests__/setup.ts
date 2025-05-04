import { afterAll, jest } from "@jest/globals";

// Configure test environment
process.env.NODE_ENV = "test";

// Global Jest configuration
jest.setTimeout(10000); // 10 second timeout

// Clean up after all tests
afterAll(async () => {
  // Any global cleanup if needed
});
