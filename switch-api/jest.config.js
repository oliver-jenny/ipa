// https://jestjs.io/docs/en/configuration.html

module.exports = {
  preset: '@shelf/jest-mongodb',
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: '../coverage',
  coverageReporters: ['json', 'html'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
