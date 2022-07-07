import request from '@/utils/request'
export const getSmsCode = (mobile) => {
  return request({
    url: `/sms/codes/${mobile}`
  })
}
export const login = ({ mobile, code }) => {
  return request({
    method: 'POST',
    url: '/authorizations',
    data: {
      mobile,
      code
    }
  })
}
export const getUserInfo = () => {
  return request({
    url: 'user'
  })
}

export const getUserProfile = () => {
  return request({
    url: 'user/profile'
  })
}

export const updateUserProfile = profile => {
  return request({
    method: 'PATCH',
    url: 'user/profile',
    data: profile
  })
}
/**
 *
 * @param {裁剪之后的头像数据} data
 * @returns
 */
export const updateAvatar = data => {
  return request({
    method: 'PATCH',
    url: 'user/photo',
    data
  })
}
