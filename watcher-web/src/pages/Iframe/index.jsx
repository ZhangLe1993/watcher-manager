import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import style from './index.less';

/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-lonely-if */
/* eslint-disable no-else-return */
/* eslint-disable consistent-return */

class Iframe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    const that = this;
    const watcherIframe = document.getElementById('watcherIframe');
    const position = this.props.location.pathname.split('/page/')[1];
    const height = document.body.scrollHeight || document.documentElement.scrollHeight;
    let checkedMenuItem;
    // window.sessionStorage.setItem('pathName', position);
    if (window.sessionStorage.getItem('currentMenuItem')) {
      checkedMenuItem = JSON.parse(window.sessionStorage.getItem('currentMenuItem'));
      const { genre, url } = checkedMenuItem;
      // 老版本
      if (genre === '0') {
        watcherIframe.src = `/route/base?position=${position}`;
        // loading状态控制
        // 设置iframe高度
        this.setState({ loading: true }, () => {
          watcherIframe.onload = () => {
            that.setState({ loading: false });
            setTimeout(() => {
              const frame = watcherIframe.contentWindow;
              const message = { parentOrigin: window.origin, msg: '收到请回复' };
              // eslint-disable-next-line no-unused-expressions
              frame && frame.postMessage(JSON.stringify(message), 'http://10.25.169.133:8112');
            }, 100);
            setTimeout(() => {
              const frame = watcherIframe.contentWindow;
              const message = { parentOrigin: window.origin, msg: '收到请回复' };
              // eslint-disable-next-line no-unused-expressions
              frame && frame.postMessage(JSON.stringify(message), 'http://10.25.169.133:8112');
            }, 3000);
            setTimeout(() => {
              const frame = watcherIframe.contentWindow;
              const message = { parentOrigin: window.origin, msg: '收到请回复' };
              // eslint-disable-next-line no-unused-expressions
              frame && frame.postMessage(JSON.stringify(message), 'http://10.25.169.133:8112');
            }, 6000);
            window.addEventListener('message', this.receiveMessage, false);
            watcherIframe.style.height = `${height}px`;// 设置iframe高度，避免出现滚动条
          };
        });
      // 新版本
      } else if (genre === '1') {
        watcherIframe.src = url;
        // iframe自适应高度
        setTimeout(() => {
          const frame = watcherIframe.contentWindow;
          const message = { parentOrigin: window.origin, msg: '收到请回复' };
          // eslint-disable-next-line no-unused-expressions
          frame && frame.postMessage(JSON.stringify(message), 'http://10.25.169.133:8112');
        }, 100);
        setTimeout(() => {
          const frame = watcherIframe.contentWindow;
          const message = { parentOrigin: window.origin, msg: '收到请回复' };
          // eslint-disable-next-line no-unused-expressions
          frame && frame.postMessage(JSON.stringify(message), 'http://10.25.169.133:8112');
        }, 3000);
        setTimeout(() => {
          const frame = watcherIframe.contentWindow;
          const message = { parentOrigin: window.origin, msg: '收到请回复' };
          // eslint-disable-next-line no-unused-expressions
          frame && frame.postMessage(JSON.stringify(message), 'http://10.25.169.133:8112');
        }, 6000);
        window.addEventListener('message', this.receiveMessage, false);
        watcherIframe.style.height = `${height}px`;// 设置iframe高度，避免出现滚动条
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const that = this;
    const prePosition = this.props.location.pathname.split('/page/')[1];
    const nextPosition = nextProps.location.pathname.split('/page/')[1];
    const height = document.body.scrollHeight || document.documentElement.scrollHeight;
    const watcherIframe = document.getElementById('watcherIframe');
    if (window.sessionStorage.getItem('currentMenuItem')) {
      const checkedMenuItem = JSON.parse(window.sessionStorage.getItem('currentMenuItem'));
      const { genre, url } = checkedMenuItem;
      // if (prePosition !== nextPosition) {
        // 老版本
        if (genre === '0') {
          watcherIframe.src = `/route/base?position=${nextPosition}`;
          // loading和iframe高度
          this.setState({ loading: true }, () => {
            watcherIframe.onload = () => {
              that.setState({ loading: false });
              setTimeout(() => {
                const frame = watcherIframe.contentWindow;
                const message = { parentOrigin: window.origin, msg: '收到请回复' };
                // eslint-disable-next-line no-unused-expressions
                frame && frame.postMessage(JSON.stringify(message), 'http://10.25.169.133:8112');
              }, 100);
              setTimeout(() => {
                const frame = watcherIframe.contentWindow;
                const message = { parentOrigin: window.origin, msg: '收到请回复' };
                // eslint-disable-next-line no-unused-expressions
                frame && frame.postMessage(JSON.stringify(message), 'http://10.25.169.133:8112');
              }, 3000);
              setTimeout(() => {
                const frame = watcherIframe.contentWindow;
                const message = { parentOrigin: window.origin, msg: '收到请回复' };
                // eslint-disable-next-line no-unused-expressions
                frame && frame.postMessage(JSON.stringify(message), 'http://10.25.169.133:8112');
              }, 6000);
              window.addEventListener('message', this.receiveMessage, false);
              watcherIframe.style.height = `${height}px`;// 设置iframe高度，避免出现滚动条
            };
          });
        // 新版本
        } else if (genre === '1') {
          const spin = document.getElementById('spin');
          const antSpinContainer = spin.getElementsByClassName('ant-spin-container')[0];
          // 采用移除iframe和新建iframe解决达芬奇url变化但页面不更新问题
          watcherIframe.remove();
          const newIframe = document.createElement('iframe');
          newIframe.id = 'watcherIframe';
          newIframe.src = url;
          newIframe.scrolling = 'auto';
          newIframe.frameBorder = '0';
          newIframe.style.width = '100%';
          newIframe.style.height = '100%';
          antSpinContainer.appendChild(newIframe);
          // iframe自适应高度
          setTimeout(() => {
            const frame = watcherIframe.contentWindow;
            const message = { parentOrigin: window.origin, msg: '收到请回复' };
            // eslint-disable-next-line no-unused-expressions
            frame && frame.postMessage(JSON.stringify(message), 'http://10.25.169.133:8112');
          }, 100);
          setTimeout(() => {
            const frame = watcherIframe.contentWindow;
            const message = { parentOrigin: window.origin, msg: '收到请回复' };
            // eslint-disable-next-line no-unused-expressions
            frame && frame.postMessage(JSON.stringify(message), 'http://10.25.169.133:8112');
          }, 3000);
          setTimeout(() => {
            const frame = watcherIframe.contentWindow;
            const message = { parentOrigin: window.origin, msg: '收到请回复' };
            // eslint-disable-next-line no-unused-expressions
            frame && frame.postMessage(JSON.stringify(message), 'http://10.25.169.133:8112');
          }, 6000);
          window.addEventListener('message', this.receiveMessage, false);
          watcherIframe.style.height = `${height}px`;// 设置iframe高度，避免出现滚动条
        }
      // }
    }
  }

  componentDidUpdate() {
    const { menuData } = this.props;
    const position = this.props.location.pathname.split('/page/')[1];
    if (menuData) {
      const checkedMenuItem = this.getMenuItemByPath(position, menuData);
      if (checkedMenuItem) {
        window.sessionStorage.setItem('currentMenuItem', JSON.stringify(checkedMenuItem));
        window.sessionStorage.setItem('pathName', position);
      }
    }
  }

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
    console.log(event.data, 'iframe设置的高度');
    if (event.origin !== 'http://10.25.169.133:8112' && event.origin !== 'http://47.97.240.5:8092') {
        return;
    }
    const watcherIframe = document.getElementById('watcherIframe');
    watcherIframe.style.height = `${event.data}px`;
    // window.removeEventListener('message', this.receiveMessage, false);
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
        <iframe id="watcherIframe" title="watcher" scrolling="auto" frameBorder="0" width="100%">{/* 占位 */}iframe</iframe>
        </Spin>
      </div>
    );
  }
}

export default connect(({ menu }) => ({
  menuData: menu.menuData,
  nameStrArr: menu.nameStrArr,
}))(Iframe);
