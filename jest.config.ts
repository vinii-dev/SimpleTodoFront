import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
};

export default config;
