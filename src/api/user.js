import axios from '@/utils/request'


//用户注册
export const login = data => axios({
    method:'post',
    url:'v1_0/authorizations',
    data
})
//发送验证码
export const sendSms = mobile => axios({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`,
})

//获取用户基本信息
//当箭头函数只有一句时，就可以省区return 和{}， （）=> 一句代码
//koken通过过滤器添加
export const getUserInfo = ()=> axios({
    method:'get',
    url:'/v1_0/user',
    // headers:{
    //     Authorization: `Bearer ${store.state.user.token}`
    // }
})

/**
 * 获取用户个人资料
 */
// 获取指定用户信息
export const getUserProfile = () => {
    return axios({
      method: 'GET',
      url: '/v1_0/user/profile'
    })
}

/**
 * 更新昵称,跟新性别和昵称方法一致，只不过是参数不同
 */
 export const updateUserName = data => {
    return axios({
      method: 'PATCH',
      url: '/v1_0/user/profile',
      data
    })
  }

  /**
 * 更新头像
 */
export const updateUserAvatar = data => {
  return axios({
    method: 'PATCH',
    url: '/v1_0/user/photo',
    data
  })
}