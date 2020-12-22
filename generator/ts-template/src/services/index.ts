import Vue from 'vue'
import request from './request'
import urls from './RESTFULURL'

const FUNS = {}

Object.keys(urls).forEach((key) => {
  FUNS[key] = (options = {}) => {
    return request(urls[key], options)
  }
})

Object.defineProperty(Vue.prototype, '$services', { value: FUNS })

export default FUNS
