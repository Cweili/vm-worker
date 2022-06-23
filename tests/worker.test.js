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
            path: '/a/a.js',
            src: 'module.exports = (a, b) => (a + b)',
          },
          {
            path: '/b/b.js',
            src: 'module.exports = require("../a/a")',
          },
        ],
      ],
    },
  })
  await sleep(10)
  handlers.message({
    data: {
      id: '2',
      fn: 'exec',
      args: [
        '/b/b.js',
        1,
        2,
      ],
    },
  })
  await sleep(10)
  expect(message.result).toBe(3)
})
