import request from '@/utils/request'

export function fetchRoleList () {
  return request({
    url: '/admin/role/list',
    method: 'get'
  })
}

export function fetchList (query) {
  return request({
    url: '/admin/role/page',
    method: 'get',
    params: query
  })
}

export function getObj (id) {
  return request({
    url: '/admin/role/' + id,
    method: 'get'
  })
}

export function addObj (obj) {
  return request({
    url: '/admin/role',
    method: 'post',
    data: obj
  })
}

export function putObj (obj) {
  return request({
    url: '/admin/role',
    method: 'put',
    data: obj
  })
}

export function delObj (id) {
  return request({
    url: '/admin/role/' + id,
    method: 'delete'
  })
}

export function permissionUpd (roleId, menuIds) {
  return request({
    url: '/admin/role/menu',
    method: 'put',
    params: {
      roleId: roleId,
      menuIds: menuIds
    }
  })
}

export function fetchRoleTree (roleName) {
  return request({
    url: '/admin/menu/tree/' + roleName,
    method: 'get'
  })
}
