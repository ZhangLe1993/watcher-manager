import request from '@/utils/request';

// 新增操作权限
export async function addPermission(params) {
  return request('/permission', {
    method: 'POST',
    data: params,
  });
}

// 修改操作权限
export async function modifyPermission(params) {
  return request('/permission', {
    method: 'PUT',
    data: params,
  });
}

// 删除操作权限
export async function deletePermission(params) {
  return request(`/permission?id=${params}`, {
    method: 'DELETE',
  });
}

// 查询操作权限
export async function queryPermission(params) {
  const { pageIndex, pageSize, key } = params;
  const url = `/permission?key=${key}&page_index=${pageIndex}&page_size=${pageSize}`;
  return request(url, {
    method: 'GET',
  });
}

// 新增角色
export async function addRole(params) {
  return request('/role', {
    method: 'POST',
    data: params,
  });
}

// 修改角色
export async function modifyRole(params) {
  return request('/role', {
    method: 'PUT',
    data: params,
  });
}

// 删除角色
export async function deleteRole(params) {
  return request(`/role?id=${params}`, {
    method: 'DELETE',
  });
}

// 查询操作权限
export async function queryRole(params) {
  const { pageIndex, pageSize, key } = params;
  const url = `/role?key=${key}&page_index=${pageIndex}&page_size=${pageSize}`;
  return request(url, {
    method: 'GET',
  });
}
