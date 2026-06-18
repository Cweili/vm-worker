import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve as resolvePath } from 'node:path'

export async function resolve(specifier, context, nextResolve) {
  // 尝试为无扩展名的相对导入添加 .ts 扩展名
  if (
    (context.parentURL || '').startsWith('file:') &&
    (specifier.startsWith('./') || specifier.startsWith('../'))
  ) {
    const lastSegment = specifier.split('/').pop()
    if (lastSegment && !lastSegment.includes('.')) {
      const parentDir = dirname(fileURLToPath(context.parentURL))
      const tsPath = resolvePath(parentDir, specifier + '.ts')
      if (existsSync(tsPath)) {
        return nextResolve(specifier + '.ts', context)
      }
    }
  }
  return nextResolve(specifier, context)
}

export async function load(url, context, nextLoad) {
  // .plugin.iife.js 文件在 dist/workers/ 目录下：作为字符串默认导出
  if (url.includes('dist/workers/') && url.endsWith('.plugin.iife.js')) {
    const filePath = fileURLToPath(url)
    const content = readFileSync(filePath, 'utf-8')
    return {
      format: 'module',
      source: `export default ${JSON.stringify(content)}`,
      shortCircuit: true,
    }
  }
  // .worker.iife.js 文件在 dist/workers/ 目录下
  if (url.includes('dist/workers/') && url.endsWith('.worker.iife.js')) {
    if (url.includes('vm-worker.worker')) {
      // 主 worker：导入 src/worker/index.ts 来设置 self 监听器
      const filePath = fileURLToPath(url)
      const projectDir = dirname(dirname(dirname(filePath)))
      const workerIndexPath = resolvePath(projectDir, 'src/worker/index.ts')
      const workerImportURL = pathToFileURL(workerIndexPath).href
      return {
        format: 'module',
        source: `import '${workerImportURL}'; export default ""`,
        shortCircuit: true,
      }
    }
    // plugin worker：不需要在测试中单独加载
    return {
      format: 'module',
      source: `export default ""`,
      shortCircuit: true,
    }
  }
  return nextLoad(url, context)
}
