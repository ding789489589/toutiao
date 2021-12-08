import axios from '@/utils/request'


//获取频道分类列表
export const getUserChannels = () => {
    return axios({
      method: 'GET',
      url: '/v1_0/user/channels'
    })
}

//获取所有频道分类列表
export const getAllChannels = ()=> axios({
    method:'GET',
    url:'/v1_0/channels'
  })



//获取文章列表
export const getArticles = params => {
    return axios({
      method: 'GET',
      url: '/v1_1/articles',
      params
    })
}

/**
 * 添加用户频道
 */
 export const addUserChannel = channel => {
  return axios({
    method: 'PATCH',
    url: '/v1_0/user/channels',
    data: {
      channels: [channel]
    }
  })
}