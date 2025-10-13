/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  verbose: true,
  
  extensionsToTreatAsEsm: ['.ts'],
  
  moduleFileExtensions: ['ts', 'js', 'json'],
  
  testMatch: ['**/__tests__/**/*.test.ts'],
  
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  
  transformIgnorePatterns: [],
  
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
