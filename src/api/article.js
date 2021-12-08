import axios from '@/utils/request'

/**
 * 根据 id 获取指定文章
 */
 export const getArticleByID = articleId => {
  return axios({
    method: 'GET',
    url: `/v1_0/articles/${articleId}`
  })
}

/**
 * 添加关注
 */
 export const addFollow = userId => {
  return axios({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

/**
 * 取消关注
 */
export const delFollow = userId => {
  return axios({
    method: 'DELETE',
    url: `/v1_0/user/followings/${userId}`
  })
}

/**
 * 收藏文章
 */
export const addCollect = target => {
  return axios({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: {
      target
    }
  })
}

/**
 * 取消收藏文章
 */
export const deleteCollect = target => {
  return axios({
    method: 'DELETE',
    url: `/v1_0/article/collections/${target}`
  })
}


/**
 * 点赞
 */
 export const addLike = articleId => {
  return axios({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}

/**
 * 取消点赞
 */
export const delLike = articleId => {
  return axios({
    method: 'DELETE',
    url: `/v1_0/article/likings/${articleId}`
  })
}

