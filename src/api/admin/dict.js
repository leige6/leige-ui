import request from '@/utils/request'

export function fetchList (query) {
  return request({
    url: '/admin/dict/page',
    method: 'get',
    params: query
  })
}

export function fetchDetailList (query) {
  return request({
    url: '/admin/dict/getDetailList',
    method: 'get',
    params: query
  })
}

export function validateCode (query) {
  return request({
    url: '/admin/dict/validateCode',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: '/admin/dict/',
    method: 'post',
    data: obj
  })
}

export function addDetailObj (obj) {
  return request({
    url: '/admin/dict/detail/save',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: '/admin/dict/' + id,
    method: 'get'
  })
}

export function getDetailObj (id) {
  return request({
    url: '/admin/dict/detail/' + id,
    method: 'get'
  })
}

export function delObj (row) {
  return request({
    url: '/admin/dict/' + row.id + '/' + row.code,
    method: 'delete'
  })
}

export function delDetailObj (row) {
  return request({
    url: '/admin/dict/detail/' + row.id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: '/admin/dict/',
    method: 'put',
    data: obj
  })
}

export function putDetailObj (obj) {
  return request({
    url: '/admin/dict/detail/update',
    method: 'put',
    data: obj
  })
}

export function remote (type) {
  return request({
    url: '/admin/dict/type/' + type,
    method: 'get'
  })
}
