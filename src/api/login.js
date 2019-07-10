import request from '@/utils/request'

const scope = 'server'
export const loginByUsername = (username, password, code, randomStr) => {
  const grantType = 'password'
  return request({
    url: '/auth/oauth/token',
    headers: {
      isToken: false,
      'TENANT_ID': '1',
      'Authorization': 'Basic cGlnOnBpZw=='
    },
    method: 'post',
    params: { username, password, randomStr, code, grantType, scope }
  })
}

export const refreshToken = (refreshToken) => {
  const grantType = 'refresh_token'
  return request({
    url: '/auth/oauth/token',
    headers: {
      'isToken': false,
      'TENANT_ID': '1',
      'Authorization': 'Basic cGlnOnBpZw=='
    },
    method: 'post',
    params: { refreshToken, grantType, scope }
  })
}

export const getUserInfo = () => {
  return request({
    url: '/admin/user/info',
    method: 'get'
  })
}

export const logout = () => {
  return request({
    url: '/auth/token/logout',
    method: 'delete'
  })
}
