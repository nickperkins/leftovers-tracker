import { Pact } from '@pact-foundation/pact';
import path from 'path';

// Configure the mock server
export const provider = new Pact({
  consumer: 'LeftoverTrackerClient',
  provider: 'LeftoverTrackerAPI',
  port: 8888,
  cors: true,
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'info',
  spec: 2,
});