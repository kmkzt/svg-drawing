module.exports = {
  verbose: true,
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  testEnvironment: 'jest-environment-jsdom',
  testRegex: '(\\.|/)(test|spec)\\.(t|j)sx?$',
  moduleNameMapper: {},
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/packages/**/src/**/**.(t|j)s?(x)'],
}
