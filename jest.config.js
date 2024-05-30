module.exports = {
  // other configuration...
  preset: 'js-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.js?$': 'js-jest',
  },
  transformIgnorePatterns: [
    "/node_modules/(?!react-bootstrap).+\\.js$"
  ]
};
