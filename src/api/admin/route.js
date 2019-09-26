import request from '@/utils/request'

export function fetchList (query) {
  return request({
    url: '/admin/route',
    method: 'get',
    params: query
  })
}

export function putObj (obj) {
  return request({
    url: '/admin/route',
    method: 'put',
    data: obj
  })
}
