import request from '@/utils/request'

const scope = 'server'
export const loginByUsername = (username, password, code, randomStr) => {
  const grant_type = 'password'
  return request({
    url: '/auth/oauth/token',
    headers: {
      isToken: false,
      'TENANT_ID': '1',
      'Authorization': 'Basic cGlnOnBpZw=='
    },
    method: 'post',
    params: { username, password, randomStr, code, grant_type, scope }
  })
}

export const refreshToken = (refreshToken) => {
  const grant_type = 'refresh_token'
  return request({
    url: '/auth/oauth/token',
    headers: {
      'isToken': false,
      'TENANT_ID': '1',
      'Authorization': 'Basic cGlnOnBpZw=='
    },
    method: 'post',
    params: { refreshToken, grant_type, scope }
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
