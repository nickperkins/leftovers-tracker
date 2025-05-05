/** @type {import('jest').Config} */
export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': './jest.transform.mjs',
    '\\.svg$': 'jest-transform-stub',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.svg$': '<rootDir>/src/__mocks__/svgMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setupTests.ts'],
  testMatch: ['<rootDir>/src/**/*.test.(js|jsx|ts|tsx)'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
};