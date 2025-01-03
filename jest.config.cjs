// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // or 'jsdom' if you're testing browser-related code
  testMatch: [
    '**/?(*.)+(spec|test).+(js)', // Matches files with .spec.js, .test.js, etc.
  ],
  transform: {},
};
