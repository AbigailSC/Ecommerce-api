module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@routes': './src/routes',
          '@controllers': './src/controllers',
          '@constants': './src/constants',
          '@utils': './src/utils',
          '@models': './src/models',
          '@services': './src/services',
          '@middlewares': './src/middlewares',
          '@config': './src/config',
          '@interfaces': './src/interfaces',
          '@docs': './src/docs',
          '@validations': './src/validations'
        }
      }
    ]
  ]
};
