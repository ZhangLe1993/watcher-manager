import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';

import style from './index.less';
import {
  queryCurrentMenuItem,
} from '../../services/iframe';
import {
  findMenuItem,
  getCleanArr,
} from '../../utils/utils';

class Iframe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  getQueryValue(queryName) {
      var query = decodeURI(window.location.search.substring(1));
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split("=");
          if (pair[0] == queryName) { return pair[1]; }
      }
      return null;
  }

  componentDidMount() {
    const that = this;
    const watcherIframe = document.getElementById('watcherIframe');
    const height = document.body.scrollHeight || document.documentElement.scrollHeight;
    const token = this.getQueryValue('token');
    watcherIframe.src = `/route/davinci?token=${token}&t=${new Date().getTime()}`;
      this.setState({ loading: true }, () => {
        watcherIframe.onload = () => {
          that.setState({ loading: false });
          window.addEventListener('message', this.receiveMessage, false);
          watcherIframe.style.height = `${height}px`;// 设置iframe高度，避免出现滚动条
        };
      });
  }

  // componentWillReceiveProps(nextProps) {
  //   const that = this;
  //   const prePosition = this.getPosition(this.props.location.pathname);
  //   const nextPosition = this.getPosition(nextProps.location.pathname);
  //   const height = document.body.scrollHeight || document.documentElement.scrollHeight;
  //   const watcherIframe = document.getElementById('watcherIframe');
  //   if (prePosition !== nextPosition) {
  //     const token = this.getQueryValue('token');
  //     watcherIframe.src = `/route/davinci?token=${token}&t=${new Date().getTime()}`;
  //     this.setState({ loading: true }, () => {
  //       watcherIframe.onload = () => {
  //         that.setState({ loading: false });
  //         window.addEventListener('message', this.receiveMessage, false);
  //         watcherIframe.style.height = `${height}px`;// 设置iframe高度，避免出现滚动条
  //       };
  //     });
  //   }
  // }

  saveMenuName = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/saveMenuName',
      payload,
    });
  }

  calcPageHeight = doc => {
    const cHeight = Math.max(doc.body.clientHeight, doc.documentElement.clientHeight);
    const sHeight = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
    const height = Math.max(cHeight, sHeight);
    return height;
  }

  receiveMessage = event => {
    const watcherIframe = document.getElementById('watcherIframe');
    watcherIframe.style.height = `${event.data}px`;
  }

  getSunbMenuData = () => {
    const { menuData } = this.props;
    const subMenuData = [];
    for (let i = 0, len = menuData.length; i < len; i += 1) {
      if (menuData[i].children) {
        subMenuData.push(menuData[i].children);
      }
    }
    return subMenuData;
  }

  checkedMenuItem = subMenuData => {
    let checkedName = [];
    for (let i = 0, len = subMenuData.length; i < len; i += 1) {
      if (subMenuData[i].children) {
        this.checkedMenuItem(subMenuData[i].children);
      } else {
        checkedName = checkedName.concat(subMenuData[i]);
      }
    }
    return checkedName;
  }

  findMenuItem = (pathName, node, prefix) => {
    const { component, name, children } = node;
    const nameStr = `${prefix}/${node.name}`;
    if (children) {
      for (let i = 0, len = children.length; i < len; i += 1) {
        const temp = this.findMenuItem(pathName, children[i], nameStr);
        if (temp != null) {
          return temp;
        }
      }
    } else {
      if (component === pathName) {
        return nameStr;
      } else {
        return null;
      }
    }
  }

  getMenuItemByPath = (key, data) => {
    let selectedMenuItem;
    for (let i = 0, len = data.length; i < len; i += 1) {
      const { children, component } = data[i];
      if (children) {
        selectedMenuItem = this.getMenuItemByPath(key, children);
        if (selectedMenuItem) {
          break;
        }
      } else {
        if (key === component) {
          selectedMenuItem = data[i];
          break;
        }
      }
    }
    return selectedMenuItem;
  }

  render() {
    return (
      <div style={{ height: '100%' }} id="iframeWrapper">
        <Spin delay={200} spinning={this.state.loading} id="spin">
          <iframe id="watcherIframe" title="watcher" scrolling="auto" frameBorder="0" width="100%" style={{minHeight:850}}>{/* 占位 */}iframe</iframe>
        </Spin>
      </div>
    );
  }
}

export default connect(({ menu }) => ({
  menuData: menu.menuData,
  nameStrArr: menu.nameStrArr,
}))(Iframe);
