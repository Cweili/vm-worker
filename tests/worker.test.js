const handlers = {}
let message

global.self = {
  addEventListener(eventName, handler) {
    handlers[eventName] = handler
  },
  postMessage(msg) {
    message = msg
  },
}

function sleep(seconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds)
  })
}

it('should execute modules', async () => {
  await import('../src/worker')
  handlers.message({
    data: {
      id: '1',
      fn: 'require',
      args: [
        [
          {
            path: 'index.js',
            url: 'https://cdn.jsdelivr.net/gh/Cweili/vm-worker@master/tests/mocks/a.js',
          },
          {
            path: 'b/b.js',
            src: 'module.exports = require("..")',
          },
          {
            path: '/c/c.js',
            src: 'module.exports = (a, b) => require("../b/b")(a, b) + require("../")(a, b)',
          },
        ],
      ],
    },
  })
  await sleep(2000)
  handlers.message({
    data: {
      id: '2',
      fn: 'exec',
      args: [
        '/c/c.js',
        1,
        2,
      ],
    },
  })
  await sleep(10)
  expect(message.result).toBe(6)
})

it('should handlers module not exist', async () => {
  await import('../src/worker')

  await sleep(10)
  handlers.message({
    data: {
      id: '3',
      fn: 'exec',
      args: [
        '/d/d.js',
      ],
    },
  })
  await sleep(10)
  expect(message.error).toBeTruthy()
})
