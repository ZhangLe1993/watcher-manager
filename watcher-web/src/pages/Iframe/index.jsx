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
    watcherIframe.style.height = `${height}px`;// 设置iframe高度，避免出现滚动条
    watcherIframe.src = `/route/base?position=${position}`;
    this.setState({ loading: true }, () => {
      watcherIframe.onload = () => {
        that.setState({ loading: false });
      };
    });
  }


  componentWillReceiveProps(nextProps) {
    const that = this;
    const prePosition = this.props.location.pathname.split('/page/')[1];
    const nextPosition = nextProps.location.pathname.split('/page/')[1];
    if (prePosition !== nextPosition) {
      const watcherIframe = document.getElementById('watcherIframe');
      const height = document.body.scrollHeight ||
      document.documentElement.scrollHeight;
      this.setState({ loading: true }, () => {
        watcherIframe.onload = () => {
          that.setState({ loading: false });
        };
      });
      watcherIframe.style.height = `${height}px`;// 设置iframe高度，避免出现滚动条
      watcherIframe.src = `/route/base?position=${nextPosition}`;
    }
  }

  render() {
    return (
      <div style={{ height: '100%' }} id="iframeWrapper">
        <Spin delay={200} spinning={this.state.loading}>
        <iframe id="watcherIframe" title="watcher" scrolling="auto" frameBorder="0" width="100%" height="100%">{/* 占位 */}iframe</iframe>
        </Spin>
      </div>
    );
  }
}

// export default connect(({ menu }) => ({
//   menuData: menu.menuData,
// }))(Iframe);

export default Iframe;
