/** @type {import('jest').Config} */
export default {
  projects: [
    '<rootDir>/client/jest.config.js',
    '<rootDir>/server/jest.config.js'
  ],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**'
  ],
  // This allows running Jest from the workspace root
  testPathIgnorePatterns: ['/node_modules/', '/dist/']
};