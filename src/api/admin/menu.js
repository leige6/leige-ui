import request from '@/utils/request'

export function GetMenu () {
  return request({
    url: '/admin/menu',
    method: 'get'
  })
}

export function fetchMenuTree (query) {
  return request({
    url: '/admin/menu/tree',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: '/admin/menu',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: '/admin/menu/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: '/admin/menu/' + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: '/admin/menu',
    method: 'put',
    data: obj
  })
}
/*
  根据角色id获取菜单
 */
export function fetchMenuByRoid (id) {
  return request({
    url: '/admin/menu/tree/' + id,
    method: 'get'
  })
}
