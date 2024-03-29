import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import url from '@rollup/plugin-url'
import { string } from 'rollup-plugin-string'
import { terser } from 'rollup-plugin-terser'

const plugins = [
  resolve(),
  babel(),
]

const pluginModules = [
  'esmodule',
  'sucrase',
]

export default pluginModules
  .map((pluginModule) => (
    {
      input: `src/plugins/${pluginModule}/worker.js`,
      output: [
        {
          file: `dist/workers/${pluginModule}.plugin.txt`,
          format: 'iife',
        },
      ],
      plugins: plugins
        .concat([
          commonjs(),
          terser({
            compress: {
              drop_debugger: false,
            },
          }),
        ]),
    }
  ))
  .concat(
    pluginModules.map((pluginModule) => (
      {
        input: `src/plugins/${pluginModule}/index.js`,
        output: [
          {
            file: `dist/plugins/${pluginModule}.cjs.js`,
            format: 'cjs',
            exports: 'default',
          },
          {
            file: `dist/plugins/${pluginModule}.esm.js`,
            format: 'es',
          },
          {
            file: `dist/plugins/${pluginModule}.js`,
            format: 'umd',
            name: `VmWorker${pluginModule[0].toUpperCase()}${pluginModule.substr(1)}Plugin`,
          },
        ],
        plugins: plugins.concat(
          string({
            include: '**/*.txt',
          }),
        ),
      }
    )),
  )
  .concat([
    {
      input: 'src/worker/index.js',
      output: [
        {
          file: 'dist/workers/vm-worker.worker.txt',
          format: 'iife',
        },
      ],
      plugins: plugins
        .concat([
          terser({
            compress: {
              drop_debugger: false,
            },
          }),
        ]),
    },
    {
      input: 'src/index.js',
      output: [
        {
          file: 'dist/vm-worker.cjs.js',
          format: 'cjs',
          exports: 'default',
        },
        {
          file: 'dist/vm-worker.esm.js',
          format: 'es',
        },
        {
          file: 'dist/vm-worker.js',
          format: 'umd',
          name: 'VmWorker',
        },
      ],
      plugins: plugins.concat(
        url({
          include: ['**/*.txt'],
          limit: Infinity,
        }),
      ),
    },
  ])
