import React from 'react';
import {
  Table,
  Divider,
  Button,
} from 'antd';

import style from './index.less';
import {
  queryMount,
} from '../../services/manager';
import MountModal from './mountModal';

// const data = [
//   {
//     key: '1',
//     name: 'John Brown',
//     age: 32,
//     address: 'New York No. 1 Lake Park',
//     tags: ['nice', 'developer'],
//   },
//   {
//     key: '2',
//     name: 'Jim Green',
//     age: 42,
//     address: 'London No. 1 Lake Park',
//     tags: ['loser'],
//   },
//   {
//     key: '3',
//     name: 'Joe Black',
//     age: 32,
//     address: 'Sidney No. 1 Lake Park',
//     tags: ['cool', 'teacher'],
//   },
// ];

/* eslint-disable no-script-url */
class WatcherManager extends React.Component {
  columns = [
    {
      title: '挂载点',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={() => this.handleActions('mount', 'modify', record)}>修改</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.handleActions('mount', 'delete', record)}>删除</a>
        </span>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      mountPageIndex: 1,
      mountPageSize: 10,
      mountKey: '',
      mountData: [],
    };
  }

  componentDidMount() {
    this.fetchMountList();
  }

  fetchMountList = () => {
    const { mountPageIndex, mountPageSize, mountKey } = this.state;
    const parameters = {
      key: mountKey,
      pageIndex: mountPageIndex,
      pageSize: mountPageSize,
    };
    queryMount(parameters).then(res => {
      console.log(res, '-res-');
      this.setState({ mountData: res.data });
    });
  }

  addMountPoint = () => {
    console.log('addMountPoint');
  }

  handleActions = (category, action, data) => {
    console.log(category, action, data, 'category, action, data');
  }

  render() {
    const { mountData } = this.state;
    return (
      <div className={style.container}>
        <Button type="primary" onClick={this.addMountPoint} className={style.btn}>新增挂载点</Button>
        <Table columns={this.columns} dataSource={mountData} bordered />
        <MountModal />
      </div>
    );
  }
}

export default WatcherManager;
