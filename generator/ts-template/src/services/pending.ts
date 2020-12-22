import axios from 'axios'
import Qs from 'qs'

const pending = new Map()

/**
 * 添加请求
 * @param config
 */
const addPending = (config) => {
  const url = [
    config.method,
    config.url,
    Qs.stringify(config.params),
    config.data
  ].join('&')
  config.cancelToken = config.cancelToken ||
    new axios.CancelToken(cancel => {
      if (!pending.has(url)) {
        pending.set(url, cancel)
      }
    })
}

/**
 * 移除请求
 * @param config
 */
const removePending = (config) => {
  const url = [
    config.method,
    config.url,
    Qs.stringify(config.params),
    config.data
  ].join('&')
  if (pending.has(url)) {
    const cancel = pending.get(url)
    cancel(url)
    pending.delete(url)
  }
}

/**
 * 清空请求（路由跳转）
 */
const clearPending = () => {
  for (const [url, cancel] of pending) {
    cancel(url)
  }

  pending.clear()
}

export { addPending, removePending, clearPending }
