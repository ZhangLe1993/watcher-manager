/* eslint-disable consistent-return */
/* eslint-disable guard-for-in */
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';

import style from './index.less';
import { getMenuItemByPath } from '../../utils/utils';


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clickNumArr: [],
    };
  }

  componentDidMount() {
    const that = this;
    let clickNumMap = {};
    const clickNumArr = [];
    if (window.localStorage.getItem('clickNumMap')) {
      clickNumMap = JSON.parse(window.localStorage.getItem('clickNumMap'));
      // 对象转数组
      // eslint-disable-next-line no-restricted-syntax
      for (const k in clickNumMap) {
        clickNumArr.push({
          key: k,
          value: clickNumMap[k][0],//点击数
          path: clickNumMap[k][1],//路径
        });
      }
      // 降序
      // eslint-disable-next-line array-callback-return
      clickNumArr.sort((a, b) => {
        if (a.value > b.value) {
          return 1;
        }
        if (a.value === b.value) {
          return 0;
        }
      });
    }
    that.setState({ clickNumArr });
  }

  findMenuItem = (pathName, node, prefix) => {
    const { component, children: children2 } = node;
    let nameStr;
    if (prefix) {
      nameStr = `${prefix}/${node.name}`;
    } else {
      nameStr = node.name;
    }
    if (children2) {
      for (let i = 0, len = children2.length; i < len; i += 1) {
        const temp = this.findMenuItem(pathName, children2[i], nameStr);
        if (temp != null) {
          return temp;
        }
      }
    } else if (component === pathName) {
        return nameStr;
      } else {
        return null;
      }
  };

  getCleanArr = arr => {
    const cleanArr = [];
    for (let i = 0, len = arr.length; i < len; i += 1) {
      if (arr[i]) {
        cleanArr.push(arr[i]);
      }
    }
    return cleanArr;
  };

  getMenuFullName = key => {
    const { menuData } = this.props;
    const titleArr = [];
    menuData.forEach(it => {
      titleArr.push(this.findMenuItem(key, it, ''));
    });
    const title = this.getCleanArr(titleArr)[0] || '首页';
    return title;
  }

  linkTo = pathName => {
    const { menuData } = this.props;
    const checkedMenuItem = getMenuItemByPath(pathName, menuData);
    window.sessionStorage.setItem('pathName', pathName);
    window.sessionStorage.setItem('currentMenuItem', JSON.stringify(checkedMenuItem));
    router.push(`${pathName}`);
  }

  render() {
    const { clickNumArr } = this.state;
    return (
      <div className={style.container}>
        {
          /*
        <ul className={style.rankContainer}>
         <li>
          <span className={style.rankNumTitle}>排名</span>
          <span className={style.name} style={{ color: '#333' }}>访问菜单路径</span>
          <span className={style.clickNum}>访问次数</span>
         </li>
        </ul>
        */}
        <div className={style.visitList}>常访问报表</div>
        {
          clickNumArr && clickNumArr.length > 0
          ? <ul className={style.rankContainer}>
              {
                clickNumArr && clickNumArr.map((it, index) => (
                  <li key={it.key} onClick={() => this.linkTo(it.path)}>
                    <span className={`${style.rankNum} ${index === 0 ? style.hot1 : ''} ${index === 1 ? style.hot2 : ''} ${index === 2 ? style.hot3 : ''}`}>{index + 1}</span>
                    <span className={style.name}>{this.getMenuFullName(it.key)}</span>
                    {/* <span className={style.clickNum}>{it.value}次</span> */}
                  </li>
                  ))
              }
            </ul>
          : <div className={style.noFooters}>您暂时还没有访问菜单记录哦!</div>
        }
      </div>
    );
  }
}

export default connect(({ menu }) => ({
  menuData: menu.menuData,
}))(Home);
