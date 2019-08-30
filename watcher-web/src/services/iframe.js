import request from '@/utils/request';

export async function queryCurrentMenuItem(parameter) {
  return request(`/menu/node/genre?position=${parameter}`);
}
