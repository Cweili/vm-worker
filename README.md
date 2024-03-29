# VM Worker

[![npm][badge-version]][npm]
[![bundle size][badge-size]][bundlephobia]
[![npm downloads][badge-downloads]][npm]
[![license][badge-license]][license]

[![github][badge-issues]][github]
[![build][badge-build]][workflows]
[![coverage][badge-coverage]][coveralls]

Tiny virtual machine for browser to execute javascript modules in Web Worker.

## Features

- Run code in a isolated scope without pollute your environment
- Support CommonJS and ESModules (by plugin)
- Support TypeScript and Flow (by plugin)
- Based on Web Worker

## Usage

### Basic usage

App.js

```js
import VM from 'vm-worker'

const vm = VM({
  debug: false, // default false
  timeout: 100000, // default 100000ms
})

await vm.require([
  {
    path: 'module-one/index.js',
    src: 'module.exports = 1',
  },
  {
    path: '/dirA/a.js',
    url: 'https://xxx.com/a.js',
  },
  {
    path: '/dirB/b.js',
    src: 'module.exports = require("../dirA/a")',
  },
])

await vm.exec('/dirB/b.js', 1, 2) // => 4

vm.terminate()
```

a.js

```js
module.exports = (a, b) => (a + b + require('module-one'))
```

### ESModule Plugin

App.js

```js
import VM from 'vm-worker'
import ESMPlugin from 'vm-worker/dist/plugins/esmodule.esm'

const vm = VM({
  plugins: [
    ESMPlugin(),
  ],
})

await vm.require([
  {
    path: 'module-one/index.js',
    src: `export const ONE = 1`
  },
  {
    path: '/dirA/a.js',
    url: 'https://xxx.com/a.js',
  },
  {
    path: '/dirB/b.js',
    src: `import { plus } from "../dirA/a"
          export default plus`,
  },
])

await vm.exec('/dirB/b.js', 1, 2) // => 4

vm.terminate()
```

a.js

```js
import { ONE } from 'module-one'

export function plus(a, b) {
  return a + b + ONE
}
```

### Sucrase plugin

Sucrase is similar to Babel, which compiles TypeScript, Flow and JSX to standard JavaScript.

[Sucrase transform options document](https://github.com/alangpierce/sucrase#transforms)

App.js

```ts
import VM from 'vm-worker'
import SucrasePlugin from 'vm-worker/dist/plugins/sucrase.esm'

const vm = VM({
  plugins: [
    SucrasePlugin({
      ... // Sucrase transform options
    }),
  ],
})

await vm.require([
  {
    path: 'module-one/index.js',
    src: `export const ONE: number = 1`
  },
  {
    path: '/dirA/a.js',
    url: 'https://xxx.com/a.js',
  },
  {
    path: '/dirB/b.js',
    src: `import { plus } from "../dirA/a"
          export default plus`,
  },
])

await vm.exec('/dirB/b.js', 1, 2) // => 4

vm.terminate()
```

a.js

```ts
import { ONE } from 'module-one'

export function plus(a: number, b: number) {
  return a + b + ONE
}
```

## Installation

```sh
npm i vm-worker
```

[badge-version]: https://img.shields.io/npm/v/vm-worker.svg
[badge-downloads]: https://img.shields.io/npm/dt/vm-worker.svg
[npm]: https://www.npmjs.com/package/vm-worker

[badge-size]: https://img.shields.io/bundlephobia/minzip/vm-worker.svg
[bundlephobia]: https://bundlephobia.com/result?p=vm-worker

[badge-license]: https://img.shields.io/npm/l/vm-worker.svg
[license]: https://github.com/Cweili/vm-worker/blob/master/LICENSE

[badge-issues]: https://img.shields.io/github/issues/Cweili/vm-worker.svg
[github]: https://github.com/Cweili/vm-worker

[badge-build]: https://img.shields.io/github/actions/workflow/status/Cweili/vm-worker/ci.yml?branch=master
[workflows]: https://github.com/Cweili/vm-worker/actions/workflows/ci.yml?query=branch%3Amaster

[badge-coverage]: https://img.shields.io/coveralls/github/Cweili/vm-worker/master.svg
[coveralls]: https://coveralls.io/github/Cweili/vm-worker?branch=master
