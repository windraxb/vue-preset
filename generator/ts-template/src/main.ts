import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './bus'
import './filters'
import './services'
import './router/router.interceptor'
import './assets/style/app.less'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
