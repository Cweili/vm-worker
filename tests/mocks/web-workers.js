/* eslint-disable class-methods-use-this */
import mitt from 'mitt'

const host = mitt()
const worker = mitt()

class Worker {
  addEventListener(eventName, listener) {
    host.on(eventName, listener)
  }

  postMessage(data) {
    worker.emit('message', { data })
  }

  terminate() {
  }
}

global.Worker = Worker
global.self = {
  addEventListener: (eventName, listener) => {
    worker.on(eventName, listener)
  },
  postMessage: (data) => {
    host.emit('message', { data })
  },
}
