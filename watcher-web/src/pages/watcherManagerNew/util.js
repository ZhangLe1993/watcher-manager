/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export default function treeDataTranslate (data, id = 'position', pid = 'parentPosition') {
  let res = []
  let temp = {}
  for (let i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (let k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1;
      if(!checkInArray(data[k],temp[data[k][pid]]['children'])){
        temp[data[k][pid]]['children'].push(data[k])
      }
    } else {
      if(!checkInArray(data[k],res)){
        res.push(data[k])
      }
    }
  }
  return res;
}

/**
 * 检查对象是否存在于数组中
 * @param obj  obj目标对象
 * @param arr  数组对象
 */
function checkInArray(obj, arr) {
  let set = new Set();
  arr.forEach((item)=>{
    set.add(JSON.stringify(item));
  });
  let flag = set.has(JSON.stringify(obj));
  return flag;
}
