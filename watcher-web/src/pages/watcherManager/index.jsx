/* eslint-disable consistent-return */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable no-param-reassign */
/* eslint-disable eslint-comments/disable-enable-pair */
import React from 'react';
import {
  Table,
  Divider,
  Button,
  Modal,
  Input,
  Select,
  Form,
  message,
  Popconfirm,
  TreeSelect,
  Transfer,
  Radio,
  // InputNumber,
} from 'antd';
import difference from 'lodash/difference';

import style from './index.less';
import {
  queryMount,
  modifyMount,
  deleteMount,
  addMount,
  queryFolder,
  addFolder,
  queryNode,
  queryParentNode,
  modifyFolder,
  deleteFolder,
  addNode,
  modifyNode,
  deleteNode,
  queryUserAuth,
  queryAllAuth,
  doMenuAuth,
  queryAllParentNode,
  clearAll,
  clear,
  mountSort,
  folderSort,
  nodeSort,
} from '../../services/manager';

/* eslint-disable no-script-url */
const envMap = {
  0: 'dev',
  1: 'prod',
};
const { Option } = Select;
const FormItem = Form.Item;
const { Group } = Radio;
const leftTableColumns = [
  {
    dataIndex: 'auth',
    title: '权限名',
  },
];
const rightTableColumns = [
  {
    dataIndex: 'auth',
    title: '权限名',
  },
];
@Form.create()
class WatcherManager extends React.Component {
  mountColumns = [
    {
      title: '挂载点',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: '排序',
      dataIndex: 'sortNo',
      key: 'sortNo',
      width: '30%',
      render: (text, record) => (
        <div>
          {
            record.isEdit
              ? <Input min={0} defaultValue={record.sortNo} onBlur={e => this.handleSortNo('mount', record, e)} onPressEnter={e => this.handleSortNo('mount', record, e)} style={{ width: '100%' }} />
              : <span className={style.sortNo} onDoubleClick={() => this.handleInputEdit('mount', record)}>{record.sortNo}</span>
          }
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={() => this.handleActions('mount', 'modify', record)}>修改</a>
          <Divider type="vertical" />
          <Popconfirm title={`是否删除${record.name}?`} onConfirm={() => this.handleActions('mount', 'delete', record)}
            okText="确定" cancelText="取消">
            <a href="javascript:;">删除</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  folderColumns = [
    {
      title: '文件夹',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: '环境',
      dataIndex: 'state',
      key: 'state',
      width: '20%',
      render: text => <span>{envMap[text]}</span>,
    },
    {
      title: '排序',
      dataIndex: 'sortNo',
      key: 'sortNo',
      width: '20%',
      render: (text, record) => (
        <div>
          {
            record.isEdit
              ? <Input min={0} defaultValue={record.sortNo} onBlur={e => this.handleSortNo('folder', record, e)} onPressEnter={e => this.handleSortNo('folder', record, e)} style={{ width: '100%' }} />
              : <span className={style.sortNo} onDoubleClick={() => this.handleInputEdit('folder', record)}>{record.sortNo}</span>
          }
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={() => this.handleActions('folder', 'modify', record)}>修改</a>
          <Divider type="vertical" />
          <Popconfirm title={`是否删除${record.name}?`} onConfirm={() => this.handleActions('folder', 'delete', record)}
            okText="确定" cancelText="取消">
            <a href="javascript:;">删除</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  nodeColumns = [
    {
      title: '报表节点',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: '权限',
      dataIndex: 'auth',
      key: 'auth',
      width: '20%',
    },
    {
      title: '排序',
      dataIndex: 'sortNo',
      key: 'sortNo',
      width: '20%',
      render: (text, record) => (
        <div>
          {
            record.isEdit
              ? <Input min={0} defaultValue={record.sortNo} onBlur={e => this.handleSortNo('node', record, e)} onPressEnter={e => this.handleSortNo('node', record, e)} style={{ width: '100%' }} />
              : <span className={style.sortNo} onDoubleClick={() => this.handleInputEdit('node', record)}>{record.sortNo}</span>
          }
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={() => this.handleActions('node', 'modify', record)}>修改2</a>
          <Divider type="vertical" />
          <Popconfirm title={`是否删除${record.name}?`} onConfirm={() => this.handleActions('node', 'delete', record)}
            okText="确定" cancelText="取消">
            <a href="javascript:;">删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.handleEmpowerment(record.position)}>赋权</a>
        </span>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      mount: {
        pageIndex: 1,
        pageSize: 10,
        key: '',
        visible: false,
        isAdd: false,
        id: '',
        data: [],
        total: 0,
      },
      folder: {
        pageIndex: 1,
        pageSize: 10,
        key: '',
        parent: '',
        visible: false,
        isAdd: false,
        id: '',
        data: [],
        total: 0,
        parentTree: [],
      },
      node: {
        pageIndex: 1,
        pageSize: 10,
        key: '',
        parent: '',
        visible: false,
        isAdd: false,
        id: '',
        data: [],
        total: 0,
        parentTree: [],
        parentPosition: '',
      },
      authority: {
        visible: false,
        allAuth: [],
        userAuth: [],
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        loading: false,
        position: '',
        modalLoading: false,
      },
    };
  }

  componentDidMount() {
    this.fetchMountList();
    this.fetchFolderList();
    this.fetchNodeList();
  }

  fetchMountList = () => {
    const { mount: { pageIndex, pageSize, key } } = this.state;
    const that = this;
    const parameters = {
      key,
      pageIndex,
      pageSize,
    };
    queryMount(parameters).then(res => {
      res.data.forEach(it => {
        // eslint-disable-next-line no-param-reassign
        it.key = it.id;
        it.isEdit = false;
      });
      this.setState({
        mount: {
          ...that.state.mount,
          data: res.data,
          total: res.total,
        }
      });
    });
  }

  fetchFolderList = () => {
    const { folder: { pageIndex, pageSize, key, parent } } = this.state;
    const that = this;
    const parameters = {
      key,
      pageIndex,
      pageSize,
      parent,
    };
    queryFolder(parameters).then(res => {
      res.data.forEach(it => {
        // eslint-disable-next-line no-param-reassign
        it.key = it.id;
        it.isEdit = false;
      });
      this.setState({
        folder: {
          ...that.state.folder,
          data: res.data,
          total: res.total,
        }
      });
    });
  }

  fetchNodeList = () => {
    const { node: { pageIndex, pageSize, key, parent } } = this.state;
    const that = this;
    const parameters = {
      key,
      pageIndex,
      pageSize,
      parent,
    };
    queryNode(parameters).then(res => {
      res.data.forEach(it => {
        // eslint-disable-next-line no-param-reassign
        it.key = it.id;
        it.isEdit = false;
      });
      this.setState({
        node: {
          ...that.state.node,
          data: res.data,
          total: res.total,
        }
      });
    });
  }

  add = category => {
    const { form: { setFieldsValue } } = this.props;
    const that = this;
    this.setState({
      [`${category}`]: {
        ...that.state[`${category}`],
        visible: true,
        isAdd: true,
        id: '',
        mount: '',
        parentPosition: '',
      }
    });
    switch (category) {
      case 'mount':
        setFieldsValue({ name: '', mountState: '' });
        break;
      case 'folder':
        setFieldsValue({ mount: '', parentPosition: '', folderName: '', folderState: '' });
        break;
      default:
        queryAllParentNode().then(res => {
          that.setState({
            node: {
              ...that.state.node,
              parentTree: res,
            }
          });
        });
        setFieldsValue({
          url: '',
          nodename: '',
          nodeState: '',
          isRootNode: '0',
        });
        break;
    }
  }

  handleActions = (category, action, data) => {
    const { form: { setFieldsValue } } = this.props;
    const newCategory = category.substring(0, 1).toUpperCase() + category.substring(1);
    const {
      name,
      id,
      mount,
      parentPosition,
      position,
      state,
      url,
    } = data;
    const that = this;
    let newParentPosition = parentPosition;
    if (parentPosition === '-1') {
      newParentPosition = '无';
    }
    if (action === 'delete') {
      this[`delete${newCategory}Func`](id);
    } else if (action === 'modify') {
      this.setState({
        [`${category}`]: {
          ...that.state[category],
          visible: true,
          isAdd: false,
          id,
          parentPosition: newParentPosition,
          mount,
        }
      });
      switch (category) {
        case 'mount':
          setFieldsValue({ name, mountState: state });
          break;
        case 'folder':
          queryParentNode(mount).then(res => {
            const temp = this.setTargetValueDisable(position, res);
            this.setState({
              folder: {
                ...that.state.folder,
                parentTree: temp,
              }
            });
          });
          setFieldsValue({
            mount,
            parentPosition: newParentPosition,
            folderName: name,
            folderState: state,
          });
          break;
        default:
          queryAllParentNode().then(res => {
            this.setState({
              node: {
                ...that.state.node,
                parentTree: res,
              }
            });
            this.props.form.setFieldsValue({nodeParentPosition:that.state.node.parentPosition});
          });
          // eslint-disable-next-line no-case-declarations
          let isRootNode = '0';
          if (mount !== 0) {
            isRootNode = '1';
          }
          setFieldsValue({
            url,
            isRootNode,
            nodename: name,
            nodeState: state,
          });
          break;
      }
    }
  }

  setTargetValueDisable = (position, data) => {
    for (let i = 0, len = data.length; i < len; i += 1) {
      const { children, value } = data[i];
      if (children.length === 0) {
        if (position === value) {
          // eslint-disable-next-line no-param-reassign
          data[i].disabled = true;
          break;
        }
      } else {
        this.setTargetValueDisable(position, children);
      }
    }
    return data;
  }

  handleModalOk = category => {
    const that = this;
    const { id, isAdd, parentTree } = that.state[category];
    this.setState({
      [category]: {
        ...that.state[category],
        visible: false,
      }
    });
    const newCategory = category.substring(0, 1).toUpperCase() + category.substring(1);
    this.props.form.validateFields((err, values) => {
      const {
        name,
        mount,
        folderName,
        folderState,
        mountState,
        url,
        nodename,
        nodeMount,
        nodeParentPosition,
        nodeState,
      } = values;
      let parameters;
      let { parentPosition } = values;
      if (category === 'mount') {
        parameters = {
          name,
          state: mountState,
        };
      } else if (category === 'folder') {
        if ((Array.isArray(parentTree) && parentTree.length === 0) || (parentPosition === '无')) {
          parentPosition = -1;
        }
        parameters = {
          mount,
          parentPosition,
          state: folderState,
          name: folderName,
        };
      } else if (category === 'node') {
        let newNodeParentPosition = nodeParentPosition;
        if (nodeParentPosition === '无') {
          newNodeParentPosition = -1;
        }
        parameters = {
          url,
          name: nodename,
          mount: nodeMount,
          parentPosition: newNodeParentPosition,
          state: nodeState,
        };
      }
      if (!isAdd) {
        parameters.id = id;
        this[`modify${newCategory}Func`](parameters);
      } else {
        this[`add${newCategory}Func`](parameters);
      }
    });
  }

  modifyMountFunc = parameters => {
    modifyMount(parameters).then(() => {
      message.success('修改成功');
      this.fetchMountList();
    });
  }

  deleteMountFunc = parameters => {
    deleteMount(parameters).then(() => {
      message.success('删除成功');
      this.fetchMountList();
    });
  }

  addMountFunc = parameters => {
    addMount(parameters).then(() => {
      message.success('新增成功');
      this.fetchMountList();
    });
  }

  addFolderFunc = parameters => {
    addFolder(parameters).then(() => {
      message.success('新增成功');
      this.fetchFolderList();
    });
  }

  deleteFolderFunc = parameters => {
    deleteFolder(parameters).then(() => {
      message.success('删除成功');
      this.fetchFolderList();
    });
  }

  modifyFolderFunc = parameters => {
    modifyFolder(parameters).then(() => {
      message.success('修改成功');
      this.fetchFolderList();
    });
  }

  addNodeFunc = parameters => {
    addNode(parameters).then(() => {
      message.success('新增成功');
      this.fetchNodeList();
    });
  }

  deleteNodeFunc = parameters => {
    deleteNode(parameters).then(() => {
      message.success('删除成功');
      this.fetchNodeList();
    });
  }

  modifyNodeFunc = parameters => {
    modifyNode(parameters).then(() => {
      message.success('修改成功');
      this.fetchNodeList();
    });
  }

  hideModal = category => {
    const that = this;
    this.setState({
      [category]: {
        ...that.state[category],
        visible: false,
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleMountPageChange = (page, pageSize) => {
    const that = this;
    this.setState({
      mount: {
        ...that.state.mount,
        pageIndex: page,
      }
    }, () => {
      this.fetchMountList();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleFolderPageChange = (page, pageSize) => {
    const that = this;
    this.setState({
      folder: {
        ...that.state.folder,
        pageIndex: page,
      }
    }, () => {
      this.fetchFolderList();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleNodePageChange = (page, pageSize) => {
    const that = this;
    this.setState({
      node: {
        ...that.state.node,
        pageIndex: page,
      }
    }, () => {
      this.fetchNodeList();
    });
  }

  getMountChildren = arr => {
    const children = [];
    for (let i = 0, len = arr.length; i < len; i += 1) {
      children.push(<Option value={arr[i].id}>{arr[i].name}</Option>);
    }
    return children;
  };

  handleFolderMountSelect = e => {
    const that = this;
    queryParentNode(e).then(res => {
      this.setState({
        folder: {
          ...that.state.folder,
          parentTree: res,
        }
      });
    });
  }

  handleNodeMountSelect = () => {
    const that = this;
    queryAllParentNode().then(res => {
      this.setState({
        node: {
          ...that.state.node,
          parentTree: res,
        }
      });
    });
  }

  getUserAuth = position => {
    const that = this;
    queryUserAuth(position).then(res => {
      this.setState({
        authority: {
          ...that.state.authority,
          userAuth: res,
        }
      });
    });
  };

  getAllAuth = () => {
    const that = this;
    queryAllAuth().then(res => {
      const temp = [];
      res.data.forEach(it => {
        temp.push({
          key: it,
          auth: it,
          id: it,
        });
      });
      this.setState({
        authority: {
          ...that.state.authority,
          allAuth: temp,
          total: res.total,
          loading: false,
        }
      });
    });
  }

  handleEmpowerment = position => {
    const that = this;
    this.setState({
      authority: {
        ...that.state.authority,
        visible: true,
        loading: true,
        position,
      }
    }, () => {
      this.getUserAuth(position);
      this.getAllAuth();
    });
  }

  handleAuthUpdate = () => {
    const that = this;
    this.setState({
      authority: {
        ...that.state.authority,
        visible: false,
        modalLoading: true,
      }
    }, () => {
      this.doMenuAuthFunc();
    });
  }

  hideAuthModal = () => {
    const that = this;
    this.setState({
      authority: {
        ...that.state.authority,
        visible: false,
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleAuthPageChange = (page, pageSize) => {
    const that = this;
    this.setState({
      authority: {
        ...that.state.authority,
        // eslint-disable-next-line react/no-unused-state
        pageIndex: page,
        loading: true,
      }
    }, () => {
      that.getAllAuth();
    });
  }

  handleSelectedAuth = nextTargetKeys => {
    const that = this;
    this.setState({
      authority: {
        ...that.state.authority,
        userAuth: nextTargetKeys,
      }
    });
  }

  doMenuAuthFunc = () => {
    const { position, userAuth } = this.state.authority;
    const that = this;
    const parameters = {
      position,
      auth: userAuth,
    };
    doMenuAuth(parameters).then(() => {
      message.success('菜单赋权成功!');
      this.fetchNodeList();
      this.setState({
        authority: {
          ...that.state.authority,
          modalLoading: false,
        }
      });
    });
  }

  handleFolderSearch = () => {
    const that = this;
    this.setState({
      folder: {
        ...that.state.folder,
        pageIndex: 1,
        pageSize: 10,
      }
    }, () => {
      this.fetchFolderList();
    });
  }

  handleNodeSearch = () => {
    const that = this;
    this.setState({
      node: {
        ...that.state.node,
        pageIndex: 1,
        pageSize: 10,
      }
    }, () => {
      this.fetchNodeList();
    });
  }

  handleChange = (e, type) => {
    const that = this;
    this.setState({
      [type]: {
        ...that.state[type],
        // eslint-disable-next-line react/no-unused-state
        key: e.target.value,
      }
    });
  }

  handleClear = type => {
    if (type === 'all') {
      this.clearAllFunc();
    } else if (type === 'standard') {
      this.clearFunc();
    }
  }

  clearAllFunc = () => {
    clearAll().then(() => {
      message.success('全部清除成功!');
    }).catch(e => {
      message.error(e);
    });
  }

  clearFunc = () => {
    clear().then(() => {
      message.success('标准清除成功!');
    }).catch(e => {
      message.error(e);
    });
  }

  handleInputEdit = (type, data) => {
    const temp = [].concat(this.state[type].data);
    this.setInputStatus(type, temp, data.id);
  }

  // 设置input框状态
  setInputStatus = (type, data, id) => {
    const that = this;
    data.forEach(it => {
      if (it.id === id) {
        it.isEdit = !it.isEdit;
      }
    });
    this.setState({
      [type]: {
        ...that.state[type],
        data,
      }
    });
  }

  handleSortNo = (type, data, e) => {
    const parameters = [{
      id: data.id,
      sortNo: Number(e.target.value),
    }];
    if (typeof Number(e.target.value) !== 'number') {
      return message.error('排序值必须为数字!');
    }
    this[`${type}SortFunc`](parameters);
  }

  // mount排序
  mountSortFunc = params => {
    mountSort(params).then(() => {
      message.success('修改挂载点顺序成功!');
      this.fetchMountList();
    });
  }

  // folder排序
  folderSortFunc = params => {
    folderSort(params).then(() => {
      message.success('修改文件夹顺序成功!');
      this.fetchFolderList();
    });
  }

  // node排序
  nodeSortFunc = params => {
    nodeSort(params).then(() => {
      message.success('修改文件夹顺序成功!');
      this.fetchNodeList();
    });
  }

  render() {
    const {
      mount,
      folder,
      node,
      authority,
    } = this.state;
    //  const pagination = {
    //     current: authority.pageIndex,
    //     pageSize: authority.pageSize,
    //     total: authority.total,
    //     hideOnSinglePage: true,
    //     showQuickJumper: true,
    //     onChange: this.handleAuthPageChange,
    //  };
    const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
      <Transfer {...restProps} showSelectAll={false}>
        {({
          direction,
          filteredItems,
          onItemSelectAll,
          onItemSelect,
          selectedKeys: listSelectedKeys,
          disabled: listDisabled,
        }) => {
          const columns = direction === 'left' ? leftColumns : rightColumns;
          const rowSelection = {
            getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
            onSelectAll(selected, selectedRows) {
              const treeSelectedKeys = selectedRows
                .filter(item => !item.disabled)
                .map(({ key }) => key);
              const diffKeys = selected
                ? difference(treeSelectedKeys, listSelectedKeys)
                : difference(listSelectedKeys, treeSelectedKeys);
              onItemSelectAll(diffKeys, selected);
            },
            onSelect({ key }, selected) {
              onItemSelect(key, selected);
            },
            selectedRowKeys: listSelectedKeys,
          };
          return (
            <Table
              loading={authority.loading}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredItems}
              size="small"
              style={{ pointerEvents: listDisabled ? 'none' : null }}
              onRow={({ key, disabled: itemDisabled }) => ({
                onClick: () => {
                  if (itemDisabled || listDisabled) return;
                  onItemSelect(key, !listSelectedKeys.includes(key));
                },
              })}
            // pagination={ direction === 'left' ? pagination : false}
            />
          );
        }}
      </Transfer>
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
    };
    const formItemLayout2 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    const mountPagination = {
      pageSize: mount.pageSize,
      total: mount.total,
      showQuickJumper: true,
      hideOnSinglePage: true,
      current: mount.pageIndex,
      onChange: this.handleMountPageChange,
    };
    const folderPagination = {
      pageSize: folder.pageSize,
      total: folder.total,
      showQuickJumper: true,
      hideOnSinglePage: true,
      current: folder.pageIndex,
      onChange: this.handleFolderPageChange,
    };
    const nodePagination = {
      pageSize: node.pageSize,
      total: node.total,
      showQuickJumper: true,
      hideOnSinglePage: true,
      current: node.pageIndex,
      onChange: this.handleNodePageChange,
    };
    const { form: { getFieldDecorator, getFieldValue } } = this.props;
    const mountChildren = this.getMountChildren(mount.data);
    const nodeChildren = this.getMountChildren(mount.data);
    const isRootNode = getFieldValue('isRootNode');
    return (
      <div className={style.container}>
        <div className={style.clearBtns}><Button type="primary" onClick={() => this.handleClear('all')} style={{ marginRight: '20px' }}>全部清除</Button><Button type="primary" onClick={() => this.handleClear('standard')}>标准清除</Button></div>
        <Button type="primary" onClick={() => this.add('mount')} className={style.btn}>新增挂载点</Button>
        <Table
          columns={this.mountColumns}
          dataSource={mount.data}
          bordered
          pagination={mountPagination}
        />
        <div className={`${style.btnSearch} ${style.clearfix}`}>
          <div className={style.btnContainer}> <Button type="primary" onClick={() => this.add('folder')} className={style.btn}>新增文件夹</Button></div>
          <div className={style.searchWrapper}>
            <Input placeholder="请输入关键字" className={style.search} onChange={e => this.handleChange(e, 'folder')} />
            <Button type="primary" onClick={this.handleFolderSearch}>搜索文件夹</Button>
          </div>
        </div>
        <Table
          columns={this.folderColumns}
          dataSource={folder.data}
          bordered
          pagination={folderPagination}
        />
        <div className={`${style.btnSearch} ${style.clearfix}`}>
          <div className={style.btnContainer}><Button type="primary" onClick={() => this.add('node')} className={style.btn}>新增报表节点</Button></div>
          <div className={style.searchWrapper}>
            <Input placeholder="请输入关键字" className={style.search} onChange={e => this.handleChange(e, 'node')} />
            <Button type="primary" onClick={this.handleNodeSearch}>搜索文报表节点</Button>
          </div>
        </div>
        <Table
          columns={this.nodeColumns}
          dataSource={node.data}
          bordered
          pagination={nodePagination}
        />
        <Modal
          title="挂载点"
          visible={mount.visible}
          onOk={() => this.handleModalOk('mount')}
          onCancel={() => this.hideModal('mount')}
        >
          <Form {...formItemLayout}>
            <FormItem label="挂载点">
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: '请输入用户名',
                }],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem label="环境">
              {getFieldDecorator('mountState', {
                rules: [{
                  required: true, message: '请选择环境',
                }],
              })(
                <Select
                  placeholder="请选择环境"
                  style={{ width: '100%' }}
                >
                  <Option value="0">dev</Option>
                  <Option value="1">pro</Option>
                </Select>,
              )}
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="文件夹"
          visible={folder.visible}
          onOk={() => this.handleModalOk('folder')}
          onCancel={() => this.hideModal('folder')}
        >
          <Form {...formItemLayout}>
            <FormItem label="挂载点">
              {getFieldDecorator('mount', {
                rules: [{
                  required: true, message: '请选择挂载点',
                }],
              })(
                <Select
                  placeholder="请排序"
                  style={{ width: '100%' }}
                  onChange={this.handleFolderMountSelect}
                >
                  {mountChildren}
                </Select>,
              )}
            </FormItem>
            <FormItem label="父节点">
              {getFieldDecorator('parentPosition', {
                rules: [{
                  required: true, message: '请选择父节点',
                }],
              })(
                <TreeSelect
                  showSearch
                  style={{ width: 300 }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={folder.parentTree}
                  disabled={Array.isArray(folder.parentTree) && folder.parentTree.length === 0}
                  placeholder="请先选择挂载点"
                  treeDefaultExpandAll
                  treeNodeFilterProp="title"
                />,
              )}
            </FormItem>
            <FormItem label="名称">
              {getFieldDecorator('folderName', {
                rules: [{
                  required: true, message: '请输入文件夹名称',
                }],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem label="环境">
              {getFieldDecorator('folderState', {
                rules: [{
                  required: true, message: '请选择环境',
                }],
              })(
                <Select
                  placeholder="请选择环境"
                  style={{ width: '100%' }}
                >
                  <Option value="0">dev</Option>
                  <Option value="1">pro</Option>
                </Select>,
              )}
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="报表节点"
          visible={node.visible}
          onOk={() => this.handleModalOk('node')}
          onCancel={() => this.hideModal('node')}
        >
          <Form {...formItemLayout2}>
            <FormItem label="达芬奇地址">
              {getFieldDecorator('url', {
                rules: [{
                  required: true, message: '请输入',
                }],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem label="是否根节点">
              {getFieldDecorator('isRootNode', {
                rules: [{ required: true, message: '请输入' }],
              })(
                <Group>
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </Group>,
              )}
            </FormItem>
            {
              isRootNode === '1'
                ? <FormItem label="挂载点">
                  {getFieldDecorator('nodeMount', {
                    rules: [{
                      required: true, message: '请选择挂载点',
                    }],
                    initialValue: node.mount,
                  })(
                    <Select
                      placeholder="请选择挂载点"
                      style={{ width: '100%' }}
                      onChange={this.handleNodeMountSelect}
                    >
                      {nodeChildren}
                    </Select>,
                  )}
                </FormItem>
                : null
            }
            {
              isRootNode === '0'
                ? <FormItem label="父节点">
                  {getFieldDecorator('nodeParentPosition', {
                    rules: [{
                      required: true, message: '请选择父节点',
                    }],
                    initialValue: node.parentPosition,
                  })(
                    <TreeSelect
                      showSearch
                      style={{ width: 300 }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={node.parentTree}
                      placeholder="请选择父节点"
                      treeDefaultExpandAll
                      treeNodeFilterProp="title"
                    />,
                  )}
                </FormItem>
                : null
            }
            <FormItem label="名称">
              {getFieldDecorator('nodename', {
                rules: [{
                  required: true, message: '请输入报表节点名称',
                }],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem label="环境">
              {getFieldDecorator('nodeState', {
                rules: [{
                  required: true, message: '请选择环境',
                }],
              })(
                <Select
                  placeholder="请选择环境"
                  style={{ width: '100%' }}
                >
                  <Option value="0">dev</Option>
                  <Option value="1">pro</Option>
                </Select>,
              )}
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="赋权限"
          visible={authority.visible}
          onOk={this.handleAuthUpdate}
          onCancel={this.hideAuthModal}
          width={1000}
          confirmLoading={authority.modalLoading}
        >
          <TableTransfer
            dataSource={authority.allAuth}
            targetKeys={authority.userAuth}
            showSearch
            onChange={this.handleSelectedAuth}
            filterOption={(inputValue, item) => item.auth.indexOf(inputValue) !== -1}
            leftColumns={leftTableColumns}
            rightColumns={rightTableColumns}
          />
        </Modal>
      </div>
    );
  }
}

export default WatcherManager;
