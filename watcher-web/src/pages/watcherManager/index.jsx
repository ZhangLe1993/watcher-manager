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
} from 'antd';

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
} from '../../services/manager';

 /* eslint-disable no-script-url */
const envMap = {
  0: 'dev',
  1: 'prod',
};
const { Option } = Select;
const FormItem = Form.Item;
@Form.create()
class WatcherManager extends React.Component {
  mountColumns = [
    {
      title: '挂载点',
      dataIndex: 'name',
      key: 'name',
      width: '60%',
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
      width: '30%',
    },
    {
      title: '环境',
      dataIndex: 'state',
      key: 'state',
      width: '30%',
      render: text => <span>{envMap[text]}</span>,
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
      width: '30%',
    },
    {
      title: '权限',
      dataIndex: 'auth',
      key: 'auth',
      width: '30%',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={() => this.handleActions('node', 'modify', record)}>修改</a>
          <Divider type="vertical" />
          <Popconfirm title={`是否删除${record.name}?`} onConfirm={() => this.handleActions('node', 'delete', record)}
          okText="确定" cancelText="取消">
              <a href="javascript:;">删除</a>
          </Popconfirm>
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
      },
      folderParentTree: [],
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
      });
      this.setState({ mount: {
        ...that.state.mount,
        data: res.data,
        total: res.total,
      } });
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
      });
      this.setState({ folder: {
        ...that.state.folder,
        data: res.data,
        total: res.total,
      } });
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
      });
      this.setState({ node: {
        ...that.state.node,
        data: res.data,
        total: res.total,
      } });
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
       } });
    switch (category) {
      case 'mount':
        setFieldsValue({ name: '', mountState: '' });
        break;
      case 'folder':
        setFieldsValue({ mount: '', parentPosition: '', folderName: '', folderState: '' });
        break;
      default:
        setFieldsValue({ url: '', nodeMount: '', nodeParentPosition: '', nodename: '', nodeState: '' });
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
      state,
      url,
    } = data;
    const that = this;
    if (action === 'delete') {
      this[`delete${newCategory}Func`](id);
    } else if (action === 'modify') {
      this.setState({
        [`${category}`]: {
          ...that.state[category],
          visible: true,
          isAdd: false,
          id,
        } });
      switch (category) {
        case 'mount':
          setFieldsValue({ name, mountState: state });
          break;
        case 'folder':
          // console.log(mount, parentPosition, name, state);
          queryParentNode(mount).then(res => {
            this.setState({ folderParentTree: res });
          });
          setFieldsValue({ mount, parentPosition, folderName: name, folderState: state });
          break;
        default:
          queryParentNode(mount).then(res => {
            this.setState({ folderParentTree: res });
          });
          setFieldsValue({
            url,
            nodeMount: mount,
            nodeParentPosition: parentPosition,
            nodename: name,
            nodeState: state,
          });
          break;
      }
    }
  }

  handleModalOk = category => {
    const that = this;
    const { id, isAdd } = that.state[category];
    this.setState({ [category]: {
      ...that.state[category],
      visible: false,
    } });
    const newCategory = category.substring(0, 1).toUpperCase() + category.substring(1);
    this.props.form.validateFields((err, values) => {
      // if (!err) {
        console.log(values, '-values-');
        const {
          name,
          mount,
          parentPosition,
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
        if (category === 'mount') {
          parameters = {
            name,
            state: mountState,
          };
        } else if (category === 'folder') {
          parameters = {
            mount,
            parentPosition,
            state: folderState,
            name: folderName,
          };
        } else if (category === 'node') {
          parameters = {
            url,
            name: nodename,
            mount: nodeMount,
            parentPosition: nodeParentPosition,
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
      } });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleMountPageChange = (page, pageSize) => {
    const that = this;
    this.setState({ mount: {
      ...that.state.mount,
      pageIndex: page,
    } }, () => {
      this.fetchMountList();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleFolderPageChange = (page, pageSize) => {
    const that = this;
    this.setState({ folder: {
      ...that.state.folder,
      pageIndex: page,
    } }, () => {
      this.fetchFolderList();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleNodePageChange = (page, pageSize) => {
    const that = this;
    this.setState({ node: {
      ...that.state.node,
      pageIndex: page,
    } }, () => {
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

  handleMountSelect = e => {
    queryParentNode(e).then(res => {
      this.setState({ folderParentTree: res });
    });
  }

  render() {
    const {
      mount,
      folder,
      node,
      folderParentTree,
     } = this.state;
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
    const { form: { getFieldDecorator } } = this.props;
    const mountChildren = this.getMountChildren(mount.data);
    const nodeChildren = this.getMountChildren(mount.data);
    return (
      <div className={style.container}>
        <Button type="primary" onClick={() => this.add('mount')} className={style.btn}>新增挂载点</Button>
        <Table
          columns={this.mountColumns}
          dataSource={mount.data}
          bordered
          pagination={mountPagination}
        />
        <Button type="primary" onClick={() => this.add('folder')} className={style.btn}>新增文件夹</Button>
        <Table
          columns={this.folderColumns}
          dataSource={folder.data}
          bordered
          pagination={folderPagination}
        />
        <Button type="primary" onClick={() => this.add('node')} className={style.btn}>新增报表节点</Button>
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
                onChange={this.handleMountSelect}
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
              treeData={folderParentTree}
              placeholder="请先选择挂载点"
              treeDefaultExpandAll
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
      <FormItem label="挂载点">
          {getFieldDecorator('nodeMount', {
            rules: [{
              required: true, message: '请选择挂载点',
            }],
          })(
            <Select
                placeholder="请排序"
                style={{ width: '100%' }}
                onChange={this.handleMountSelect}
              >
               {nodeChildren}
              </Select>,
          )}
      </FormItem>
       <FormItem label="父节点">
        {getFieldDecorator('nodeParentPosition', {
          rules: [{
            required: true, message: '请选择父节点',
          }],
        })(
          <TreeSelect
            showSearch
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={folderParentTree}
            placeholder="请先选择挂载点"
            treeDefaultExpandAll
          />,
        )}
      </FormItem>
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
      </div>
    );
  }
}

export default WatcherManager;
