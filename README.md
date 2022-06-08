# VM Worker

[![npm][badge-version]][npm]
<!-- [![bundle size][badge-size]][bundlephobia] -->
[![npm downloads][badge-downloads]][npm]
[![license][badge-license]][license]
[![github][badge-issues]][github]
<!-- [![build][badge-build]][workflows]
[![coverage][badge-coverage]][coveralls] -->

Tiny VM for browser to execute commonjs modules in Web Worker.

## Usage

App.js

```js
import VM from 'vm-worker'

const vm = VM()

await vm.require([
  {
    path: 'a.js',
    url: 'https://xxx.com/a.js',
  },
  {
    path: 'b.js',
    src: 'module.exports = require("./a")',
  },
])

await vm.exec('b.js', 1, 2) // => 3
```

a.js

```js
module.exports = (a, b) => (a + b)
```

## Installation

```sh
npm i vm-worker
```

**VM Worker depends on `worker-loader`, so it only works with Webpack.**

[badge-version]: https://img.shields.io/npm/v/vm-worker.svg
[badge-downloads]: https://img.shields.io/npm/dt/vm-worker.svg
[npm]: https://www.npmjs.com/package/vm-worker

<!-- [badge-size]: https://img.shields.io/bundlephobia/minzip/vm-worker.svg
[bundlephobia]: https://bundlephobia.com/result?p=vm-worker -->

[badge-license]: https://img.shields.io/npm/l/vm-worker.svg
[license]: https://github.com/Cweili/vm-worker/blob/master/LICENSE

[badge-issues]: https://img.shields.io/github/issues/Cweili/vm-worker.svg
[github]: https://github.com/Cweili/vm-worker

<!-- [badge-build]: https://img.shields.io/github/workflow/status/Cweili/vm-worker/ci/master
[workflows]: https://github.com/Cweili/vm-worker/actions/workflows/ci.yml?query=branch%3Amaster

[badge-coverage]: https://img.shields.io/coveralls/github/Cweili/vm-worker/master.svg
[coveralls]: https://coveralls.io/github/Cweili/vm-worker?branch=master -->
