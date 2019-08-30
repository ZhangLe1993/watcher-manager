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

// 查询操作权限
export async function queryAllPermission() {
  return request('/permission', {
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

// 查询角色
export async function queryRole(params) {
  const { pageIndex, pageSize, key } = params;
  const url = `/role?key=${key}&page_index=${pageIndex}&page_size=${pageSize}`;
  return request(url, {
    method: 'GET',
  });
}


// 查询所有角色
export async function queryAllRole() {
  const url = '/role';
  return request(url, {
    method: 'GET',
  });
}

// 查询用户
export async function queryUser(params) {
  const { pageIndex, pageSize, key } = params;
  const url = `/user/list?key=${key}&page_index=${pageIndex}&page_size=${pageSize}`;
  return request(url, {
    method: 'GET',
  });
}

// 查询所有用户
export async function queryAllUser() {
  return request('/user/list');
}

// 用户已绑定角色
export async function queryBindRole(params) {
  return request(`/user/role?ob_id=${params}`, {
    method: 'GET',
  });
}

// 用户绑定角色
export async function bindRole(params) {
  return request('/user/role', {
    method: 'POST',
    data: params,
  });
}

// 角色绑定权限
export async function roleBindOperation(params) {
  return request('/role/operation', {
    method: 'POST',
    data: params,
  });
}

// 查看角色已绑定了的权限
export async function queryRoleBindOperation(params) {
  return request(`/role/operation?role_id=${params}`, {
    method: 'GET',
  });
}

// 权限已绑定的角色
export async function getAuthBindRole(params) {
  return request(`/permission/role?operation_id=${params}`);
}

// 权限绑定角色
export async function authBindRole(params) {
  return request('/permission/role', {
    method: 'POST',
    data: params,
  });
}


// 角色绑定用户
export async function roleBindUser(params) {
  return request('/role/user', {
    method: 'POST',
    data: params,
  });
}

// 查看角色已经绑定的用户
export async function getRoleBindUser(params) {
  return request(`/role/user?role_id=${params}`, {
    method: 'GET',
  });
}
