// module.exports = {
//   // other configuration...
//   preset: 'js-jest',
//   testEnvironment: 'node',
//   transform: {
//     '^.+\\.js?$': 'js-jest',
//   },
//   transformIgnorePatterns: [
//     "/node_modules/(?!react-bootstrap).+\\.js$"
//   ]
// };

// @type {import('jest').Config}
const config = {
  verbose: true,
};

module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.js?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    "/node_modules/(?!react-bootstrap).+\\.js$"
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy'
  }
};
