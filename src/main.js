import Vue from 'vue'
import App from './App'
import router from './router'
import fastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import store from './store'

import 'common/stylus/index.styl'

fastClick.attach(document.body)

Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png') // 当图片还未加载成功时，默认填充的背景图
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
