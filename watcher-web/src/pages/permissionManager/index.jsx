/* eslint-disable no-script-url */
import React from 'react';
import {
  Table,
  Divider,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Button,
} from 'antd';

import style from './index.less';
import {
  addPermission,
  deletePermission,
  modifyPermission,
  queryPermission,
} from '../../services/permission';

const FormItem = Form.Item;

@Form.create()
class PermissionManager extends React.Component {
  permissionColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: '别名',
      dataIndex: 'alias',
      key: 'alias',
      width: '30%',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={() => this.handleActions('permission', 'modify', record)}>修改</a>
          <Divider type="vertical" />
          <Popconfirm title={`是否删除${record.name}?`} onConfirm={() => this.handleActions('permission', 'delete', record)}
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
      permission: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        key: '',
        data: [],
        loading: false,
        visible: false,
        id: null,
      },
    };
  }

  componentDidMount() {
    this.fetchPermissionList();
  }

  fetchPermissionList = () => {
    const { permission: { pageIndex, pageSize, key } } = this.state;
    const that = this;
    const parameters = {
      key,
      pageIndex,
      pageSize,
    };
    queryPermission(parameters).then(res => {
      console.log(res, '-fetchPermissionList-');
      this.setState({ permission: {
        ...that.state.permission,
        data: res.data,
        total: res.total,
        loading: false,
      } });
    });
  }

  handleActions = (type, action, data) => {
    console.log(type, action, data);
    const that = this;
    const { form: { setFieldsValue } } = this.props;
    const condition = `${type}-${action}`;
    switch (condition) {
      case 'permission-delete':
        this.deletePermissionFunc(data.id);
        break;
      case 'permission-modify':
      case 'permission-add':
          this.setState({ permission: {
            ...that.state.permission,
            visible: true,
            id: data.id,
          } });
          // eslint-disable-next-line comma-dangle
          setFieldsValue({
            permissionName: data.name,
            permissionAlias: data.alias,
            permissionDescription: data.description,
           });
          break;
      default:
        break;
    }
  }

  deletePermissionFunc = id => {
    const that = this;
    deletePermission(id).then(() => {
      message.success('删除权限成功!');
      this.setState({ permission: {
        ...that.state.permission,
        loading: true,
      } });
      this.fetchPermissionList();
    });
  }

  handlePermissionPageChange = (page, pageSize) => {
    const that = this;
    this.setState({ permission: {
      ...that.state.permission,
      pageIndex: page,
      loading: true,
    } }, () => {
      this.fetchPermissionList();
    });
  }

  handlePermission = () => {
    const that = this;
    this.props.form.validateFields((err, values) => {
      console.log(values, '--values--');
      const { permissionAlias, permissionName, permissionDescription } = values;
      const { id } = that.state.permission;
      const parameters = {
        name: permissionName,
        alias: permissionAlias,
        description: permissionDescription,
      };
      if (id) {
        parameters.id = id;
        this.modifyPermissionFunc(parameters);
      } else {
        this.addPermissionFunc(parameters);
      }
    });
  }

  addPermissionFunc = parameters => {
    const that = this;
    addPermission(parameters).then(() => {
      this.setState({ permission: {
        ...that.state.permission,
        visible: false,
      } });
      message.success('新增用户权限成功!');
      this.fetchPermissionList();
    });
  }

  modifyPermissionFunc = parameters => {
    const that = this;
    modifyPermission(parameters).then(() => {
      this.setState({ permission: {
        ...that.state.permission,
        visible: false,
      } });
      message.success('修改用户权限成功!');
      this.fetchPermissionList();
    });
  }


  handleCancel = type => {
    const that = this;
    this.setState({ [type]: {
      ...that.state[type],
      visible: false,
    } });
  }

  handleSearchInputChange = (e, type) => {
    const that = this;
    this.setState({ [type]: {
      ...that.state[type],
      key: e.target.value,
    } });
  }

  // handleSearch = type => {

  // }

  render() {
    const {
      permission,
    } = this.state;
    const { form: { getFieldDecorator } } = this.props;
    const permissionPagination = {
      pageSize: permission.pageSize,
      total: permission.total,
      showQuickJumper: true,
      hideOnSinglePage: true,
      current: permission.pageIndex,
      onChange: this.handlePermissionPageChange,
    };
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
    const permissionAdd = {
      name: '',
      alias: '',
      description: '',
      id: null,
    };
    return (
      <div className={style.container}>
        <div className={style.btnContainer}>
          <Button type="primary" onClick={() => this.handleActions('permission', 'add', permissionAdd)}>增加用户权限</Button>
        </div>
        <div className={style.searchWrapper}>
          <Input placeholder="请输入关键字" className={style.search} onChange={e => this.handleSearchInputChange(e, 'permission')} />
          <Button type="primary" onClick={() => this.handleSearch('permission')}>搜索用户权限</Button>
        </div>
        <Table
          columns={this.permissionColumns}
          dataSource={permission.data}
          bordered
          pagination={permissionPagination}
          loading={permission.loading}
          />
          <Modal
            title="用户权限"
            visible={permission.visible}
            onOk={this.handlePermission}
            onCancel={() => this.handleCancel('permission')}
          >
          <Form {...formItemLayout}>
            <FormItem label="名称">
              {getFieldDecorator('permissionName', {
                rules: [{
                  required: true, message: '请输入名称',
                }],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem label="别名">
              {getFieldDecorator('permissionAlias', {
                rules: [{
                  required: false, message: '请输入别名',
                }],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem label="描述">
              {getFieldDecorator('permissionDescription', {
                rules: [{
                  required: false, message: '请输入描述',
                }],
              })(
                <Input />,
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default PermissionManager;
