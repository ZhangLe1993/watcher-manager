import request from '@/utils/request';

// 查询挂载点
export async function queryMount(params) {
  const { key, pageIndex, pageSize } = params;
  return request(`/menu/mount?key=${key}&page_index=${pageIndex}&page_size=${pageSize}`);
}

// 新增挂载点
export async function addMount(params) {
  return request('/menu/mount', {
    method: 'POST',
    data: params,
  });
}

// 修改挂载点
export async function modifyMount(params) {
  return request('/menu/mount', {
    method: 'PUT',
    data: params,
  });
}

// 删除挂载点
export async function deleteMount(params) {
  return request(`/menu/mount?id=${params}`, {
    method: 'DELETE',
  });
}

// 查询文件夹
export async function queryFolder(params) {
  const { key, pageIndex, pageSize, parent } = params;
  return request(`/menu/folder?key=${key}&page_index=${pageIndex}&page_size=${pageSize}&parent=${parent}`);
}

// 新增文件夹
export async function addFolder(params) {
  return request('/menu/folder', {
    method: 'POST',
    data: params,
  });
}

// 修改文件夹
export async function modifyFolder(params) {
  return request('/menu/folder', {
    method: 'PUT',
    data: params,
  });
}

// 删除文件夹
export async function deleteFolder(params) {
  return request(`/menu/folder?id=${params}`, {
    method: 'DELETE',
  });
}

// 查询报表节点
export async function queryNode(params) {
  const { key, pageIndex, pageSize, parent } = params;
  return request(`/menu/node?key=${key}&page_index=${pageIndex}&page_size=${pageSize}&parent=${parent}`);
}

// 新增报表节点
export async function addNode(params) {
  return request('/menu/node', {
    method: 'POST',
    data: params,
  });
}

// 修改报表节点
export async function modifyNode(params) {
  return request('/menu/node', {
    method: 'PUT',
    data: params,
  });
}

// 删除文件夹
export async function deleteNode(params) {
  return request(`/menu/node?id=${params}`, {
    method: 'DELETE',
  });
}

// 节点树
export async function queryParentNode(params) {
  return request(`/menu/folder/tree?mount=${params}`);
}

// 所有节点树
export async function queryAllParentNode() {
  return request('/menu/folder/tree');
}

// 查已有的权限
export async function queryUserAuth(params) {
  return request(`/menu/auth/?position=${params}`);
}

// 查询所有的权限
export async function queryAllAuth(params) {
  const { pageIndex, pageSize } = params;
  return request(`/menu/auth/all?page_index=${pageIndex}&page_size=${pageSize}`);
}

// 菜单授权
export async function doMenuAuth(params) {
  return request('/menu/auth', {
    method: 'POST',
    data: params,
  });
}
