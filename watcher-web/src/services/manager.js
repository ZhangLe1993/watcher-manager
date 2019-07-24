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
export async function ModifyMount(params) {
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
