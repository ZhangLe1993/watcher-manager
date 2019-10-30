/* eslint-disable consistent-return */
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

const getMenuItemByPath = (key, data) => {
  let selectedMenuItem;
  for (let i = 0, len = data.length; i < len; i += 1) {
    const { children, component } = data[i];
    if (children) {
      selectedMenuItem = getMenuItemByPath(key, children);
      if (selectedMenuItem) {
        break;
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (key === component) {
        selectedMenuItem = data[i];
        break;
      }
    }
  }
  return selectedMenuItem;
};

const getCleanArr = arr => {
  const cleanArr = [];
  for (let i = 0, len = arr.length; i < len; i += 1) {
    if (arr[i]) {
      cleanArr.push(arr[i]);
    }
  }
  return cleanArr;
};

const findMenuItem = (pathName, node, prefix) => {
  const { component, children: children2 } = node;
  let nameStr;
  if (prefix) {
    nameStr = `${prefix}/${node.name}`;
  } else {
    nameStr = node.name;
  }
  if (children2) {
    for (let i = 0, len = children2.length; i < len; i += 1) {
      const temp = findMenuItem(pathName, children2[i], nameStr);
      if (temp != null) {
        return temp;
      }
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (component === pathName) {
      return nameStr;
    // eslint-disable-next-line no-else-return
    } else {
      return null;
    }
  }
};

const checkEnv = () => {
  const ua = navigator.userAgent.toLowerCase();
  const is = agent => {
    let result = agent;
    result = result.toLowerCase();
    return ua.indexOf(result) > -1;
  };

  return {
    iOS: is('iphone') || is('ipad') || is('ipod'),
    Android: is('android'),
    is,
  };
};

export {
 isAntDesignProOrDev,
 isAntDesignPro, isUrl,
 handleMenuData,
 handleMenuData2,
 addKey,
 getMenuItemByPath,
 getCleanArr,
 findMenuItem,
 checkEnv,
 };
