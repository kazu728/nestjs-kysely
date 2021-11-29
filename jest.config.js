module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: './coverage',
  coverageProvider: 'v8',
  coveragePathIgnorePatterns: [
    '<rootDir>/src/kysely.interfaces.ts',
    '<rootDir>/src/index.ts',
  ],
  moduleFileExtensions: ['ts', 'js'],
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  testRegex: 'test.ts',
  transform: { '^.+\\.ts': 'ts-jest' },
}
