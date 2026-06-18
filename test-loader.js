import { register } from 'node:module'

// 注册自定义加载器模块
// import.meta.url 在 --import 模式中可能不是有效的 file:// URL
// 使用 data URL 或直接使用相对路径
const loaderURL = new URL('./test-loader-hooks.js', import.meta.url)
register(loaderURL.href)
