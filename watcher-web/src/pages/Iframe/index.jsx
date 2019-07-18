import React from 'react';
// import { Spin } from 'antd';

import style from './index.less';

class Iframe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // loading: true,
    };
  }

  componentDidMount() {
    const position = this.props.location.pathname.split('/page/')[1];
    const watcherIframe = document.getElementById('watcherIframe');
    watcherIframe.src = `/route/base?position=${position}`;
  }


  componentWillReceiveProps(nextProps) {
    const prePosition = this.props.location.pathname.split('/page/')[1];
    const nextPosition = nextProps.location.pathname.split('/page/')[1];
    if (prePosition !== nextPosition) {
      const watcherIframe = document.getElementById('watcherIframe');
      watcherIframe.src = `/route/base?position=${nextPosition}`;
    }
  }

  handleIframe = () => {
    // this.setState({ loading: false });
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
      {
        /*
         <Spin delay={200} size="large" spinning={this.state.loading}>
         </Spin>
        */
      }
      <iframe id="watcherIframe" title="watcher" scrolling="auto" frameBorder="0" width="100%" height="100%" minHeight="1000px">{/* 占位 */}iframe</iframe>
      </div>
    );
  }
}

export default Iframe;
