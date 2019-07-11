import request from '@/utils/request';

export async function queryMenuData() {
  return request('/menu');
}

export async function queryPageView(parameter) {
  const { position } = parameter;
  return request(`/route/base?position=${position}`);
}
