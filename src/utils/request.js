import axios from 'axios'
import { create } from 'core-js/core/object'


// create方法会自定义axios实例，并且创建一个新的axios对象，相当于request对象里提前封装好了baseURL
const request = axios.create({
    baseURL:"http://ttapi.research.itcast.cn/"  //接口基准路径
})

export default request