import axios from '@/utils/request'

/**
 * 获取搜索联想建议
 */
export const getSearchSuggestion = q => {
  return axios({
    method: 'GET',
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}

/**
 * 获取搜索结果
 */
 export function getSearch(params) {
  return axios({
    method: "GET",
    url: "/v1_0/search",
    params
  })
}