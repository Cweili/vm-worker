import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import url from '@rollup/plugin-url'
import { terser } from 'rollup-plugin-terser'

const plugins = [
  resolve(),
  babel(),
  url({
    include: ['**/*.txt'],
    limit: Infinity,
  }),
]

export default [
  {
    input: 'src/worker.js',
    output: [
      {
        file: 'dist/worker.js.txt',
        format: 'iife',
      },
    ],
    plugins: plugins
      .concat([
        terser(),
      ]),
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/vm-worker.cjs.js',
        format: 'cjs',
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
    plugins,
  },
]
