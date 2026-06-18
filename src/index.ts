import VM from './vm'

export interface VMOptions {
  debug?: boolean
  timeout?: number
  plugins?: Array<[string, unknown]>
}

export default (options?: VMOptions) => new VM(options)
