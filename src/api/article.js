import request from '@/utils/request'

export const getArticle = (article_id) => {
  return request({
    url: `/articles/${article_id}`
  })
}
/**
 *
 * @param {用户id} target
 * @returns
 */
export const addUser = (target) => {
  return request({
    method: 'POST',
    url: 'user/followings',
    data: {
      target
    }
  })
}
/**
 *
 * @param {用户id} target
 * @returns
 */
export const delUser = (target) => {
  return request({
    method: 'DELETE',
    url: `user/followings/${target}`
  })
}
/**
 *
 * @param {收藏目标文章id} target
 * @returns
 */
export const addCollect = (target) => {
  return request({
    method: 'POST',
    url: 'article/collections',
    data: {
      target
    }
  })
}
/**
 *
 * @param {文章id} target
 * @returns
 */
export const delCollect = (target) => {
  return request({
    method: 'DELETE',
    url: `article/collections/${target}`
  })
}

export const getCommentList = ({ type, source, offset, limit }) => {
  return request({
    url: 'comments',
    params: {
      type,
      source,
      offset,
      limit
    }
  })
}

/**
 *
 * @param {评论id} target
 * @returns
 */
export const addLiking = (target) => {
  return request({
    method: 'POST',
    url: 'comment/likings',
    data: {
      target
    }
  })
}

/**
 *
 * @param {评论id} target
 * @returns
 */
export const delLiking = (target) => {
  return request({
    method: 'DELETE',
    url: `comment/likings/${target}`
  })
}

/**
 *
 * @param {*} data
 * @returns
 */
export const addComment = (data) => {
  return request({
    method: 'POST',
    url: 'comments',
    data
  })
}
