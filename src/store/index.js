import Vue from 'vue'
import Vuex from 'vuex'
import {setItem , getItem} from '@/utils/storage'

//vuex的注册，一定要在import store 之前，如果将Vue.use(Vuex)代码放在main中，会报错
// 原因：在解析import时，vue默认会将所有的import语句提升到最上边执行，所以import store form  ‘xxxx’这句
//      永远都会在 Vue.use（Vuex）之前！！！
Vue.use(Vuex)
const TOKEN_KEY = 'kandiansha'

export default new Vuex.Store({
  state: {
    user:JSON.parse(window.localStorage.getItem(TOKEN_KEY))
  },
  mutations: {
    setUser(state,data){
      state.user = data
      //存入本地
      setItem(TOKEN_KEY,data)
    }
  },
  actions: {
  },
  modules: {
  }
})
