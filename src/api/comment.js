/**
 * 评论接口模块
 */
 import axios from "@/utils/request";

/**
 * 获取文章列表
 */
 export function getComments(params) {
  return axios({
    method: "GET",
    url: "/v1_0/comments",
    params
  });
}

/**
 * 对评论或评论回复点赞
 */
 export function addCommentLike(commentId) {
  return axios({
    method: "POST",
    url: "/v1_0/comment/likings",
    data: {
      target: commentId
    }
  });
}

/**
 * 取消对评论或评论回复点赞
 */
export function deleteCommentLike(commentId) {
  return axios({
    method: "DELETE",
    url: `/v1_0/comment/likings/${commentId}`
  });
}


/**
 * 添加评论或评论回复
 */
 export function addComment(data) {
  return axios({
    method: "POST",
    url: "/v1_0/comments",
    data
  });
}