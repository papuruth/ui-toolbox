module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-react-jsx',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-object-assign',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-transform-react-constant-elements',
    [
      'module-resolver',
      {
        alias: {
          components: './src/components',
          pages: './src/pages',
          utils: './src/utils',
          styles: './src/styles',
          routes: './src/routes',
          localization: './src/localization',
          assets: './src/assets',
        },
      },
    ],
  ],
};
