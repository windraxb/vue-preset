/**
 * @author windraxb
 * @param prefix
 * @description 自动匹配baseUrl
 */
export default function autoMatchBaseUrl (prefix = '') {
  let baseUrl = ''
  switch (prefix) {
    default:
      baseUrl = window.LOCAL_CONFIG.API_HOME
  }

  return baseUrl
}
