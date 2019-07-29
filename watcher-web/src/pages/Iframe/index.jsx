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
    const position = this.props.location.pathname.split('/page/')[1];
    window.sessionStorage.setItem('pathName', position);
    const watcherIframe = document.getElementById('watcherIframe');
    const height = document.body.scrollHeight ||
    document.documentElement.scrollHeight;
    watcherIframe.src = `/route/base?position=${position}`;
    this.setState({ loading: true }, () => {
      watcherIframe.onload = () => {
        that.setState({ loading: false });
        setTimeout(() => {
          const frame = watcherIframe.contentWindow;
          const message = { parentOrigin: window.origin, msg: '收到请回复' };
          frame.postMessage(JSON.stringify(message), 'http://10.25.169.133:8112');
        }, 100);
        setTimeout(() => {
          const frame = watcherIframe.contentWindow;
          const message = { parentOrigin: window.origin, msg: '收到请回复' };
          frame.postMessage(JSON.stringify(message), 'http://10.25.169.133:8112');
        }, 3000);
        setTimeout(() => {
          const frame = watcherIframe.contentWindow;
          const message = { parentOrigin: window.origin, msg: '收到请回复' };
          frame.postMessage(JSON.stringify(message), 'http://10.25.169.133:8112');
        }, 6000);
        // const frame = watcherIframe.contentWindow;
        // const message = { parentOrigin: window.origin, msg: '收到请回复' };
        // frame.postMessage(JSON.stringify(message), 'http://10.25.169.133:8112');
        // console.log('父发送成功');
        window.addEventListener('message', this.receiveMessage, false);
        watcherIframe.style.height = `${height}px`;// 设置iframe高度，避免出现滚动条
      };
    });
  }


  componentWillReceiveProps(nextProps) {
    const that = this;
    const prePosition = this.props.location.pathname.split('/page/')[1];
    const nextPosition = nextProps.location.pathname.split('/page/')[1];
    if (prePosition !== nextPosition) {
      const watcherIframe = document.getElementById('watcherIframe');
      watcherIframe.src = `/route/base?position=${nextPosition}`;
      const height = document.body.scrollHeight ||
      document.documentElement.scrollHeight;
      this.setState({ loading: true }, () => {
        watcherIframe.onload = () => {
          that.setState({ loading: false });
          setTimeout(() => {
            const frame = watcherIframe.contentWindow;
            const message = { parentOrigin: window.origin, msg: '收到请回复' };
            frame.postMessage(JSON.stringify(message), 'http://10.25.169.133:8112');
          }, 100);
          setTimeout(() => {
            const frame = watcherIframe.contentWindow;
            const message = { parentOrigin: window.origin, msg: '收到请回复' };
            frame.postMessage(JSON.stringify(message), 'http://10.25.169.133:8112');
          }, 3000);
          setTimeout(() => {
            const frame = watcherIframe.contentWindow;
            const message = { parentOrigin: window.origin, msg: '收到请回复' };
            frame.postMessage(JSON.stringify(message), 'http://10.25.169.133:8112');
          }, 6000);
          window.addEventListener('message', this.receiveMessage, false);
          watcherIframe.style.height = `${height}px`;// 设置iframe高度，避免出现滚动条
        };
      });
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
    console.log(event, '子消息回来了');
    if (event.origin !== 'http://10.25.169.133:8112') {
        return;
    }
    const watcherIframe = document.getElementById('watcherIframe');
    watcherIframe.style.height = `${event.data}px`;
    window.removeEventListener('message', this.receiveMessage, false);
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

  render() {
    return (
      <div style={{ height: '100%' }} id="iframeWrapper">
        <Spin delay={200} spinning={this.state.loading}>
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

// export default Iframe;
