/* eslint no-useless-escape:0 import/prefer-default-export:0 */
/* eslint-disable no-param-reassign */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const isUrl = path => reg.test(path);

const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};

const handleMenuData = data => {
  const arr = [];
  for (let i = 0, len = data.length; i < len; i += 1) {
    const { name, children } = data[i];
    if (children) {
      const temp = handleMenuData(children);
      temp.forEach(it => {
        // [${name}/${it[0]},[data].concat(it[1])]
        arr.push(`${name}/${it}`);
      });
    } else {
      arr.push(name);
    }
  }
  return arr;
};

const handleMenuData2 = data => {
  const arr = [];
  for (let i = 0, len = data.length; i < len; i += 1) {
    const { name, children } = data[i];
    if (children) {
      const temp = handleMenuData(children);
      temp.forEach(it => {
        arr.push(`${i}${name}/${it}`);
      });
    } else {
      arr.push(`${i}${name}`);
    }
  }
  return arr;
};

const addKey = data => {
  data.forEach(it => {
    if (it.children) {
      addKey(it.children);
    } else {
      it.key = `${it.path}&${it.name}`;
    }
  });
};

export { isAntDesignProOrDev, isAntDesignPro, isUrl, handleMenuData, handleMenuData2, addKey };
