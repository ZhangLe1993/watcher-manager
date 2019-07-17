import React from 'react';

class Iframe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div>
        <iframe id="watcherIframe" title="watcher" scrolling="no" frameBorder="0" width="100%" height="100%">{/* 占位 */}</iframe>
      </div>
    );
  }
}

export default Iframe;
