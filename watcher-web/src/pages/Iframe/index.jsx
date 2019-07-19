import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import style from './index.less';

/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */

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
    const watcherIframe = document.getElementById('watcherIframe');
    const height = document.body.scrollHeight ||
    document.documentElement.scrollHeight;
    // watcherIframe.style.height = `${height}px`;// 设置iframe高度，避免出现滚动条
    watcherIframe.src = `/route/base?position=${position}`;
    this.setState({ loading: true }, () => {
      watcherIframe.onload = () => {
        that.setState({ loading: false });
        setTimeout(() => {
          const frame = watcherIframe.contentWindow;
          const message = { parentOrigin: window.origin, msg: '收到请回复' };
          frame.postMessage(JSON.stringify(message), 'http://10.25.169.133:8112');
        }, 1000);
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
          }, 1000);
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

// export default connect(({ menu }) => ({
//   menuData: menu.menuData,
// }))(Iframe);

export default Iframe;
