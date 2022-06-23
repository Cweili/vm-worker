module.exports = {
  presets: [
    [
      '@babel/preset-env', {
        loose: true,
        modules: false,
        exclude: [
          '@babel/plugin-transform-typeof-symbol',
          '@babel/plugin-transform-async-to-generator',
          '@babel/plugin-transform-regenerator',
        ],
      },
    ],
  ],
  plugins: ['module:fast-async'],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env', {
            targets: {
              node: 'current',
            },
          },
        ],
      ],
      plugins: [
        '@babel/plugin-proposal-async-generator-functions',
        [
          '@babel/plugin-transform-runtime',
          {
            regenerator: true,
          },
        ],
      ],
    },
  },
}
