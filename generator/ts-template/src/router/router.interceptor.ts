import { clearPending } from '@/services/pending'
import { Route } from 'vue-router'
import router from './index'

router.beforeEach((to: Route, from: Route, next: any) => {
  clearPending()
  next()
})
