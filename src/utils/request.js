import axios from 'axios'
import store from '@/store'
import jsonBig from 'json-bigint'


// create方法会自定义axios实例，并且创建一个新的axios对象，相当于request对象里提前封装好了baseURL
const request = axios.create({
    baseURL:"http://toutiao-app.itheima.net/",  //接口基准路径
      // transformResponse 允许自定义原始的响应数据（字符串）
    transformResponse: [function (data) {
    try {
      // 如果转换成功则返回转换的数据结果
      return jsonBig.parse(data)
    } catch (err) {
      // 如果转换失败，则包装为统一数据格式并返回
      return {
        data
      }
    }
  }]

})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
    // Do something before request is sent
    // config ：本次请求的配置对象
    // config 里面有一个属性：headers
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
  })

export default request