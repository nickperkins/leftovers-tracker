import { describe, test, beforeAll, afterAll } from '@jest/globals';
import { Verifier } from '@pact-foundation/pact';
import path from 'path';
import { startServer } from '../index';

// Import server types/models
import Leftover from '../models/Leftover';
import { sequelize } from '../config/db';

// Current date for tests
const storedDate = new Date('2025-05-01T12:00:00Z');
const expiryDate = new Date('2025-05-15T12:00:00Z');

// Mock data for tests with proper typing
const mockLeftover = {
  id: '1',
  name: 'Lasagna',
  description: 'Homemade beef lasagna',
  portion: 2,
  storageLocation: 'freezer' as const, // Use const assertion to fix the type
  storedDate: storedDate,
  expiryDate: expiryDate,
  tags: ['pasta', 'beef'],
  consumed: false,
  // consumedDate: null, // Removed to fix type issue - will be undefined by default
  createdAt: storedDate,
  updatedAt: storedDate
};

describe('Pact Verification', () => {
  let serverInfo: any;
  let port: number = 4000; // Default GraphQL server port

  // Seed test data and start server before verification
  beforeAll(async () => {
    // Create tables and seed data
    await sequelize.sync({ force: true });

    // Seed test data
    await Leftover.create(mockLeftover);

    // Start server
    serverInfo = await startServer();
    port = serverInfo.port || port;
  });

  // Stop server after verification
  afterAll(async () => {
    try {
      // Use the dedicated stopServer function
      await stopServer(serverInfo);

      // Close database connection
      await sequelize.close();

      console.log('Server and database connections closed successfully');
    } catch (error) {
      console.error('Error shutting down server:', error);
    }
  });

  // Run pact verification
  test('validates the expectations of the LeftoverTrackerClient', async () => {
    const pactUrl = path.resolve(
      process.cwd(),
      '../client/pacts/LeftoverTrackerClient-LeftoverTrackerAPI.json'
    );

    const verifier = new Verifier({
      provider: 'LefoverTrackerAPI',
      providerBaseUrl: `http://localhost:${port}/graphql`,
      pactUrls: [pactUrl],
      publishVerificationResult: false,
      providerVersion: '1.0.0',
      stateHandlers: {
        // Add state handlers if needed for specific test scenarios
      }
    });

    return verifier.verifyProvider();
  }, 30000); // Extend timeout for verification
});