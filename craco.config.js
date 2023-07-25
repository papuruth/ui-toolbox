const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@mui/styled-engine': '@mui/styled-engine-sc',
      components: path.resolve(__dirname, 'src/components'),
      pages: path.resolve(__dirname, 'src/pages'),
      utils: path.resolve(__dirname, 'src/utils'),
      styles: path.resolve(__dirname, 'src/styles'),
      routes: path.resolve(__dirname, 'src/routes'),
      localization: path.resolve(__dirname, 'src/localization'),
      assets: path.resolve(__dirname, 'src/assets'),
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^@(.*)$': '<rootDir>/src$1',
      },
    },
  },
};
