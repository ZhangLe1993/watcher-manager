import React from 'react';
import { connect } from 'dva';
import style from './index.less';

/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */

class Iframe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

  render() {
    return (
      <div style={{ height: '100%' }}>
        <iframe id="watcherIframe" title="watcher" scrolling="auto" frameBorder="0" width="100%" height="100%" minHeight="1000px">{/* 占位 */}iframe</iframe>
      </div>
    );
  }
}

// export default connect(({ menu }) => ({
//   menuData: menu.menuData,
// }))(Iframe);

export default Iframe;
