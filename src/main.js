import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant';

import 'vant/lib/index.css';
//自己的样式要写在vant的后面
import '@/styles/index.less'
//该插件用于动态这只html字体大小，用来适配移动端
import 'amfe-flexible'
import './utils/dayjs'

Vue.use(Vant);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),

  //全局事件总线的写法，有了这个谁都可以用
  // beforeCreate(){
  //   Vue.prototype.$bus = this
  // }
}).$mount('#app')
