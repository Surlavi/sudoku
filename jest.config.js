// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // or 'jsdom' if you're testing browser-related code
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)', // Matches test files in __tests__ directories
    '**/?(*.)+(spec|test).+(ts|tsx|js)', // Matches files with .spec.ts, .test.ts, etc.
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Use ts-jest to transform .ts and .tsx files
  },
};
