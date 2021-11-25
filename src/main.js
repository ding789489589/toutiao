import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant';
import './styles/index.less'
import 'vant/lib/index.css';
//该插件用于动态这只html字体大小，用来适配移动端
import 'amfe-flexible'

Vue.use(Vant);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
