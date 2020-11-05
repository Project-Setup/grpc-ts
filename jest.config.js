module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js?|ts?)$',
  globals: {
    NODE_ENV: 'test',
  },
  transform: {
    '^.+\\.(j|t)s$': 'babel-jest',
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'jest.setup.js',
    '<rootDir>/configs/',
    'jest.config.js',
    '.json',
    '.snap',
  ],
  coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/mocks.js',
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/mocks.js',
  },
};
