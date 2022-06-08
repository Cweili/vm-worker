module.exports = {
  presets: [
    [
      '@babel/preset-env',
      !process.GEM_MINE_CLI_MODERN_BUILD
        ? {
          useBuiltIns: 'entry',
          corejs: 3,
          modules: 'auto',
          loose: true,
          exclude: [
            '@babel/plugin-transform-async-to-generator',
            '@babel/plugin-transform-regenerator',
          ],
        }
        : {
          targets: {
            esmodules: true,
          },
          corejs: 3,
          useBuiltIns: 'usage',
          modules: false,
          exclude: [
            '@babel/plugin-transform-async-to-generator',
            '@babel/plugin-transform-regenerator',
          ],
        },
    ],
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: false,
        regenerator: false,
      },
    ],
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-optional-chaining',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    [
      'module:fast-async',
      {
        env: {
          log: false,
        },
        compiler: {
          promises: true,
          generators: false,
          noRuntime: true,
        },
        runtimePattern: null,
        useRuntimeModule: true,
      },
    ],
  ],
}
