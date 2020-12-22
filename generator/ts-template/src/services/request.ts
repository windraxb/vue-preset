import Qs from 'qs'
import axios, { AxiosRequestConfig } from 'axios'
import autoMatchBaseUrl from '@/services/autoMatchBaseUrl'
import { TIMEOUT } from '@/constant'
import { removePending, addPending } from '@/services/pending'

const REST_PATH_PARAM_REG = new RegExp(/(?=\{).*?(?=\})/gi)

const codeMessage: object = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}

function checkStatus (response) {
  if (response) {
    const { status, statusText } = response
    if ((status >= 200 && status < 300) || status === 304) {
      return response.data
    }
    return {
      status,
      msg: codeMessage[status] || statusText
    }
  }

  return {
    status: -404,
    msg: '网络异常'
  }
}

/**
 * 全局请求扩展
 */
const axiosRequestConfig = {
  success (config) {
    removePending(config)
    addPending(config)
    //  根据具体业务配置
    return config
  },
  error (error) {
    return Promise.reject(error)
  }
}

const axiosResponseConfig = {
  success (response) {
    removePending(response)
    return checkStatus(response)
  },
  error (error) {
    const { response } = error
    if (axios.isCancel(error)) {
      console.error('repeated request: ', error.message)
    }
    if (response) {
      return Promise.reject(checkStatus(response))
    } else {
      console.log('断网了~')
    }
  }
}

axios.interceptors.request.use(axiosRequestConfig.success, axiosRequestConfig.error)
axios.interceptors.response.use(axiosResponseConfig.success, axiosResponseConfig.error)

export default function request (url, {
  method = 'post',
  timeout = TIMEOUT,
  prefix = '',
  data = {},
  headers = {},
  dataType = 'json'
}) {
  const baseUrl = autoMatchBaseUrl(prefix)

  const formatHeaders = Object.assign({
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }, headers)

  const pathParamArr = url.match(REST_PATH_PARAM_REG)
  if (pathParamArr !== null) {
    pathParamArr.forEach(item => {
      const str = item.slice(1)
      url = url.replace(`${item}}`, data[str])
      delete data[str]
    })
  }

  const defaultConfig = {
    baseUrl,
    url,
    method,
    params: data,
    data,
    timeout,
    headers: formatHeaders,
    responseType: dataType
  }

  if (method === 'get') {
    defaultConfig.data = {}
  } else {
    defaultConfig.params = {}

    const contentType = headers['Content-Type']

    if (typeof contentType !== 'undefined') {
      if (contentType.indexOf('multipart') !== -1) {
        defaultConfig.data = data
      } else if (contentType.indexOf('json') !== -1) {
        defaultConfig.data = JSON.stringify(data)
      } else {
        defaultConfig.data = Qs.stringify(data)
      }
    }
  }

  return axios(defaultConfig as AxiosRequestConfig)
}
