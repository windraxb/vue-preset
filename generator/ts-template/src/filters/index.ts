import Vue from 'vue'

import { formatDate } from '@windraxb/cloud-utils'

export function formatTime (timeStamp: number, fmt?: string) {
  return formatDate(timeStamp, fmt)
}

const filters = {
  formatTime
}

Object.keys(filters).forEach((key: string) => {
  Vue.filter(key, filters[key])
})
