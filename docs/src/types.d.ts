declare module 'vm-worker' {
  export interface VMOptions {
    debug?: boolean
    timeout?: number
    plugins?: any[]
  }

  export interface VMFile {
    path: string
    src?: string
    url?: string
  }

  export default function VM(options?: VMOptions): {
    require(files: VMFile[]): Promise<void>
    exec(...args: any[]): Promise<any>
    terminate(): void
  }
}

declare module 'vm-worker/esmodule' {
  export default function setup(options?: any): [string, any]
}

declare module 'vm-worker/sucrase' {
  export default function setup(options?: any): [string, any]
}
