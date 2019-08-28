/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
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
  Transfer,
} from 'antd';
import difference from 'lodash/difference';

import style from './index.less';
import {
  addPermission,
  deletePermission,
  modifyPermission,
  queryPermission,
  queryAllPermission,
  addRole,
  deleteRole,
  queryRole,
  queryAllRole,
  modifyRole,
  queryUser,
  queryBindRole,
  bindRole,
  roleBindOperation,
  queryRoleBindOperation,
  getAuthBindRole,
  authBindRole,
  getRoleBindUser,
  queryAllUser,
  roleBindUser,
} from '../../services/permission';

const FormItem = Form.Item;
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
        />
      );
    }}
  </Transfer>
);

const leftTableColumns = [
  {
    dataIndex: 'name',
    title: '角色',
  },
];
const rightTableColumns = [
  {
    dataIndex: 'name',
    title: '角色',
  },
];

const roleLeftTableColumns = [
  {
    dataIndex: 'name',
    title: '权限',
  },
];
const roleRightTableColumns = [
  {
    dataIndex: 'name',
    title: '权限',
  },
];

const userLeftTableColumns = [
  {
    dataIndex: 'name',
    title: '用户',
  },
];
const userRightTableColumns = [
  {
    dataIndex: 'name',
    title: '用户',
  },
];

@Form.create()
class PermissionManager extends React.Component {
  permissionColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: '别名',
      dataIndex: 'alias',
      key: 'alias',
      width: '20%',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '20%',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={() => this.handleActions('permission', 'modify', record)}>修改</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.handleActions('permission', 'bind', record)}>绑定角色</a>
          <Divider type="vertical" />
          <Popconfirm title={`是否删除${record.name}?`} onConfirm={() => this.handleActions('permission', 'delete', record)}
          okText="确定" cancelText="取消">
              <a href="javascript:;">删除</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  roleColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: '别名',
      dataIndex: 'alias',
      key: 'alias',
      width: '20%',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '20%',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={() => this.handleActions('role', 'modify', record)}>修改</a>
          <Divider type="vertical" />
          <Popconfirm title={`是否删除${record.name}?`} onConfirm={() => this.handleActions('role', 'delete', record)}
          okText="确定" cancelText="取消">
              <a href="javascript:;">删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.handleActions('role', 'bindUser', record)}>角色绑定用户</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.handleActions('role', 'bind', record)}>绑定权限</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.handleActions('role', 'query', record)}>查看已绑定的权限</a>
        </span>
      ),
    },
  ];

  userColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: '工号',
      dataIndex: 'employeeNo',
      key: 'employeeNo',
      width: '30%',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={() => this.handleActions('user', 'bind', record)}>绑定角色</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.handleActions('user', 'query', record)}>查看已绑定的角色</a>
        </span>
      ),
    },
  ];

  userBindRoleColumns = [
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
        bindVisible: false,
        allRole: [],
        myRole: [],
      },
      role: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        key: '',
        data: [],
        loading: false,
        visible: false,
        id: null,
        queryVisible: false,
        bindVisible: false,
        roleBindVisible: false,
        roleBindOperationData: [],
        allOperation: [],
        myOperation: [],
        roleId: null,
        allUser: [],
        myUser: [],
      },
      user: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        key: '',
        data: [],
        loading: false,
        visible: false,
        id: null,
        bindVisible: false,
        queryVisible: false,
        userBindRoleData: [],
        allRole: [],
        myRole: [],
        obId: null,
      },
    };
  }

  componentDidMount() {
    this.fetchPermissionList();
    this.fetchRoleList();
    this.fetchUserList();
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
      case 'permission-bind':
            this.setState({ permission: {
              ...that.state.permission,
              bindVisible: true,
              id: data.id,
            } });
            this.getAuthBindRoleFunc(data.id);
            this.authQueryAllRoleFunc();
            break;
      case 'role-delete':
          this.deleteRoleFunc(data.id);
          break;
      case 'role-modify':
      case 'role-add':
          this.setState({ role: {
            ...that.state.role,
            visible: true,
            id: data.id,
          } });
          // eslint-disable-next-line comma-dangle
          setFieldsValue({
            roleName: data.name,
            roleAlias: data.alias,
            roleDescription: data.description,
           });
          break;
      case 'user-query':
          this.setState({ user: {
            ...that.state.user,
            queryVisible: true,
          } }, () => {
            this.queryBindRoleFunc(data.obId);
          });
        break;
      case 'user-bind':
          this.setState({ user: {
            ...that.state.user,
            bindVisible: true,
            obId: data.obId,
          } }, () => {
            this.queryAllRoleFunc();
            this.queryMyRoleFunc(data.obId);
          });
          break;
      case 'role-query':
          this.setState({ role: {
            ...that.state.role,
            queryVisible: true,
            obId: data.obId,
          } }, () => {
            this.queryRoleBindOperationFunc(data.id);
          });
          break;
      case 'role-bind':
          this.setState({ role: {
            ...that.state.role,
            bindVisible: true,
            roleId: data.id,
          } }, () => {
            this.queryAllPermissionFunc();
            this.queryRoleBindOperationFunc(data.id);
          });
          break;
      case 'role-bindUser':
          this.setState({ role: {
            ...that.state.role,
            roleBindVisible: true,
            roleId: data.id,
          } }, () => {
            this.queryAllUserFunc();
            this.getRoleBindUserFunc(data.id);
          });
        break;
      default:
        break;
    }
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

  handlePageChange = (type, page, pageSize) => {
    console.log(type, page, pageSize);
    const category = type.substring(0, 1).toUpperCase() + type.substring(1);
    const that = this;
    this.setState({ [type]: {
      ...that.state[type],
      pageIndex: page,
      loading: true,
    } }, () => {
      this[`fetch${category}List`]();
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

  handleModalOk = type => {
    const category = type.substring(0, 1).toUpperCase() + type.substring(1);
    const that = this;
    this.props.form.validateFields((err, values) => {
      console.log(values, '--values--');
      // const { permissionAlias, permissionName, permissionDescription } = values;
      const name = values[`${type}Name`];
      const alias = values[`${type}Alias`];
      const description = values[`${type}Description`];
      const { id } = that.state[type];
      const parameters = {
        name,
        alias,
        description,
      };
      if (id) {
        parameters.id = id;
        this[`modify${category}Func`](parameters);
      } else {
        this[`add${category}Func`](parameters);
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

  fetchPermissionList = () => {
    const { permission: { pageIndex, pageSize, key } } = this.state;
    const that = this;
    const parameters = {
      key,
      pageIndex,
      pageSize,
    };
    queryPermission(parameters).then(res => {
      this.setState({ permission: {
        ...that.state.permission,
        data: res.data,
        total: res.total,
        loading: false,
      } });
    });
  }

  addRoleFunc = parameters => {
    const that = this;
    addRole(parameters).then(() => {
      this.setState({ role: {
        ...that.state.role,
        visible: false,
      } });
      message.success('新增角色成功!');
      this.fetchRoleList();
    });
  }

  deleteRoleFunc = id => {
    const that = this;
    deleteRole(id).then(() => {
      message.success('删除角色成功!');
      this.setState({ role: {
        ...that.state.role,
        loading: true,
      } });
      this.fetchRoleList();
    });
  }

  modifyRoleFunc = parameters => {
    const that = this;
    modifyRole(parameters).then(() => {
      this.setState({ role: {
        ...that.state.role,
        visible: false,
      } });
      message.success('修改角色成功!');
      this.fetchRoleList();
    });
  }

  fetchRoleList = () => {
    const { role: { pageIndex, pageSize, key } } = this.state;
    const that = this;
    const parameters = {
      key,
      pageIndex,
      pageSize,
    };
    queryRole(parameters).then(res => {
      this.setState({ role: {
        ...that.state.role,
        data: res.data,
        total: res.total,
        loading: false,
      } });
    }).catch(e => {
      console.log(e, '-111--');
    });
  }

  fetchUserList = () => {
    const { user: { pageIndex, pageSize, key } } = this.state;
    const that = this;
    const parameters = {
      key,
      pageIndex,
      pageSize,
    };
    queryUser(parameters).then(res => {
      this.setState({ user: {
        ...that.state.user,
        data: res.data,
        total: res.total,
        loading: false,
      } });
    }).catch(e => {
      console.log(e, '-111--');
    });
  }

  queryBindRoleFunc = id => {
    const that = this;
    queryBindRole(id).then(res => {
      this.setState({ user: {
        ...that.state.user,
        userBindRoleData: res,
      } });
      console.log(res, '--queryBindRoleFunc--');
    });
  }

  queryAllRoleFunc = () => {
    const that = this;
    queryAllRole().then(res => {
      console.log(res, '--queryAllRoleFunc-');
      res.data.forEach(it => {
        it.key = it.id;
      });
      this.setState({ user: {
        ...that.state.user,
        allRole: res.data,
      } });
    });
  }

  queryMyRoleFunc = id => {
    const that = this;
    queryBindRole(id).then(res => {
      console.log(res, '--queryMyRoleFunc-');
      const roleIds = res.map(it => it.id);
      this.setState({ user: {
        ...that.state.user,
        myRole: roleIds,
      } });
    });
  }

  bindRoleFunc = parameters => {
    const that = this;
    bindRole(parameters).then(() => {
      message.success('用户绑定角色成功!');
      this.fetchUserList();
      this.setState({ user: {
        ...that.state.user,
        bindVisible: false,
      } });
    });
  }

  queryRoleBindOperationFunc = id => {
    const that = this;
    queryRoleBindOperation(id).then(res => {
      const myOperation = res.map(it => it.id);
      this.setState({ role: {
        ...that.state.role,
        roleBindOperationData: res,
        myOperation,
      } });
    });
  }

  queryAllPermissionFunc = () => {
    const that = this;
    queryAllPermission().then(res => {
      res.data.forEach(it => {
        it.key = it.id;
      });
      this.setState({ role: {
        ...that.state.role,
        allOperation: res.data,
      } });
    });
  }

  bindOperationFunc = parameters => {
    const that = this;
    roleBindOperation(parameters).then(() => {
      message.success('角色绑定权限成功!');
      this.fetchRoleList();
      this.setState({ role: {
        ...that.state.role,
        bindVisible: false,
      } });
    });
  }

  getAuthBindRoleFunc = id => {
    const that = this;
    getAuthBindRole(id).then(res => {
      console.log(res, '--getAuthBindRoleFunc--');
      const roleIds = res.map(it => it.id);
      this.setState({ permission: {
        ...that.state.permission,
        myRole: roleIds,
      } });
    });
  }

  authQueryAllRoleFunc = () => {
    const that = this;
    queryAllRole().then(res => {
      console.log(res, '--authQueryAllRoleFunc--');
      res.data.forEach(it => {
        it.key = it.id;
      });
      this.setState({ permission: {
        ...that.state.permission,
        allRole: res.data,
      } });
    });
  }

  authBindRoleFunc = parameters => {
    const that = this;
    authBindRole(parameters).then(() => {
      message.success('权限绑定角色成功!');
      this.setState({ permission: {
        ...that.state.permission,
        bindVisible: false,
      } });
      this.fetchPermissionList();
    });
  }

  queryAllUserFunc = () => {
    const that = this;
    queryAllUser().then(res => {
      res.data.forEach(it => {
        it.key = it.obId;
      });
      this.setState({ role: {
        ...that.state.role,
        allUser: res.data,
      } });
    });
  }

  getRoleBindUserFunc = id => {
    const that = this;
    getRoleBindUser(id).then(res => {
      const roleIds = res.map(it => it.obId);
      this.setState({ role: {
        ...that.state.role,
        myUser: roleIds,
      } });
    });
  }

  roleBindUserFunc = parameters => {
    const that = this;
    roleBindUser(parameters).then(() => {
      message.success('角色绑定用户成功!');
      this.setState({ role: {
        ...that.state.role,
        roleBindVisible: false,
      } });
      this.fetchRoleList();
    });
  }

  handleCancel = type => {
    const that = this;
    this.setState({ [type]: {
      ...that.state[type],
      visible: false,
    } });
  }

  handleUserCancel = (type, key) => {
    const that = this;
    this.setState({ [type]: {
      ...that.state[type],
      [key]: false,
    } });
  }

  handleSearchInputChange = (e, type) => {
    const that = this;
    this.setState({ [type]: {
      ...that.state[type],
      key: e.target.value,
    } });
  }

  handleTableTransferChange = (type, key, nextTargetKeys) => {
    const that = this;
    this.setState({ [type]: {
      ...that.state[type],
      [key]: nextTargetKeys,
    } });
  }

  handleSearch = type => {
    const category = type.substring(0, 1).toUpperCase() + type.substring(1);
    const that = this;
    this.setState({ [type]: {
      ...that.state[type],
      pageIndex: 1,
      loading: true,
    } }, () => {
      this[`fetch${category}List`]();
    });
  }

  handleUserOk = () => {
    const { user: { myRole, obId } } = this.state;
    const parameters = {
      ids: myRole,
      ob: obId,
    };
    if (Array.isArray(myRole) && myRole.length === 0) {
      return message.error('请至少选择一个角色!');
    }
    this.bindRoleFunc(parameters);
  }

  handleRoleOk = () => {
    const { role: { myOperation, roleId } } = this.state;
    console.log(this.state.role, '--role-');
    console.log(myOperation, '--myOperation-');
    const parameters = {
      operation: myOperation,
      role: roleId,
    };
    if (Array.isArray(myOperation) && myOperation.length === 0) {
      return message.error('请至少选择一个权限!');
    }
    this.bindOperationFunc(parameters);
  }

  handlePermissionBindRoleOk = () => {
    const { permission: { myRole, id } } = this.state;
    const parameters = {
      operation: id,
      role: myRole,
    };
    if (Array.isArray(myRole) && myRole.length === 0) {
      return message.error('请至少选择一个角色!');
    }
    this.authBindRoleFunc(parameters);
    console.log(this.state.permission, '--permission-');
  }

  handleRoleBindUserOk = () => {
    const { role: { myUser, roleId } } = this.state;
    const parameters = {
      role: roleId,
      ids: myUser,
    };
    if (Array.isArray(myUser) && myUser.length === 0) {
      return message.error('请至少选择一个用户!');
    }
    this.roleBindUserFunc(parameters);
    console.log(this.state.role, '--role-');
  }

  render() {
    const {
      permission,
      role,
      user,
    } = this.state;
    const { form: { getFieldDecorator } } = this.props;
    const permissionPagination = {
      pageSize: permission.pageSize,
      total: permission.total,
      showQuickJumper: true,
      hideOnSinglePage: true,
      current: permission.pageIndex,
      onChange: (page, pageSize) => this.handlePageChange('permission', page, pageSize),
    };
    const rolePagination = {
      pageSize: role.pageSize,
      total: role.total,
      showQuickJumper: true,
      hideOnSinglePage: true,
      current: role.pageIndex,
      onChange: (page, pageSize) => this.handlePageChange('role', page, pageSize),
    };
    const userPagination = {
      pageSize: user.pageSize,
      total: user.total,
      showQuickJumper: true,
      hideOnSinglePage: true,
      current: user.pageIndex,
      onChange: (page, pageSize) => this.handlePageChange('user', page, pageSize),
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
         <div style={{ marginBottom: '16px' }}>
          <Input placeholder="请输入关键字" className={style.search} onChange={e => this.handleSearchInputChange(e, 'user')} />
          <Button type="primary" onClick={() => this.handleSearch('user')}>搜索用户</Button>
         </div>
        <Table
          columns={this.userColumns}
          dataSource={user.data}
          bordered
          pagination={userPagination}
          loading={user.loading}
        />
        <div className={`${style.btnSearch} ${style.clearfix}`}>
          <div className={style.btnContainer}>
            <Button type="primary" onClick={() => this.handleActions('role', 'add', permissionAdd)}>增加角色</Button>
          </div>
          <div className={style.searchWrapper}>
            <Input placeholder="请输入关键字" className={style.search} onChange={e => this.handleSearchInputChange(e, 'role')} />
            <Button type="primary" onClick={() => this.handleSearch('role')}>搜索角色</Button>
          </div>
        </div>
         <Table
          columns={this.roleColumns}
          dataSource={role.data}
          bordered
          pagination={rolePagination}
          loading={role.loading}
          />
        <div className={`${style.btnSearch} ${style.clearfix}`}>
          <div className={style.btnContainer}>
            <Button type="primary" onClick={() => this.handleActions('permission', 'add', permissionAdd)}>增加用户权限</Button>
          </div>
          <div className={style.searchWrapper}>
            <Input placeholder="请输入关键字" className={style.search} onChange={e => this.handleSearchInputChange(e, 'permission')} />
            <Button type="primary" onClick={() => this.handleSearch('permission')}>搜索用户权限</Button>
          </div>
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
            onOk={() => this.handleModalOk('permission')}
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
        <Modal
            title="角色"
            visible={role.visible}
            onOk={() => this.handleModalOk('role')}
            onCancel={() => this.handleCancel('role')}
          >
          <Form {...formItemLayout}>
            <FormItem label="名称">
              {getFieldDecorator('roleName', {
                rules: [{
                  required: true, message: '请输入名称',
                }],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem label="别名">
              {getFieldDecorator('roleAlias', {
                rules: [{
                  required: false, message: '请输入别名',
                }],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem label="描述">
              {getFieldDecorator('roleDescription', {
                rules: [{
                  required: false, message: '请输入描述',
                }],
              })(
                <Input />,
              )}
            </FormItem>
          </Form>
        </Modal>
        <Modal
            title="绑定角色"
            visible={user.bindVisible}
            onOk={() => this.handleUserOk()}
            onCancel={() => this.handleUserCancel('user', 'bindVisible')}
            width={1000}
          >
          <TableTransfer
            dataSource={user.allRole}
            targetKeys={user.myRole}
            showSearch
            onChange={nextTargetKeys => this.handleTableTransferChange('user', 'myRole', nextTargetKeys)}
            filterOption={(inputValue, item) => item.name.indexOf(inputValue) !== -1}
            leftColumns={leftTableColumns}
            rightColumns={rightTableColumns}
          />
        </Modal>
        <Modal
          title="已绑定的角色"
          visible={user.queryVisible}
          onOk={() => this.handleUserCancel('user', 'queryVisible')}
          onCancel={() => this.handleUserCancel('user', 'queryVisible')}
          width={1000}
          >
           <Table
            columns={this.userBindRoleColumns}
            dataSource={user.userBindRoleData}
            bordered
            // pagination={rolePagination}
            // loading={user.loading}
           />
        </Modal>
        <Modal
          title="已绑定的权限"
          visible={role.queryVisible}
          onOk={() => this.handleUserCancel('role', 'queryVisible')}
          onCancel={() => this.handleUserCancel('role', 'queryVisible')}
          width={1000}
          >
           <Table
            columns={this.userBindRoleColumns}
            dataSource={role.roleBindOperationData}
            bordered
            // pagination={rolePagination}
            // loading={user.loading}
           />
        </Modal>
        <Modal
          title="绑定权限"
          visible={role.bindVisible}
          onOk={() => this.handleRoleOk()}
          onCancel={() => this.handleUserCancel('role', 'bindVisible')}
          width={1000}
        >
        <TableTransfer
          dataSource={role.allOperation}
          targetKeys={role.myOperation}
          showSearch
          onChange={nextTargetKeys => this.handleTableTransferChange('role', 'myOperation', nextTargetKeys)}
          filterOption={(inputValue, item) => item.name.indexOf(inputValue) !== -1}
          leftColumns={roleLeftTableColumns}
          rightColumns={roleRightTableColumns}
        />
      </Modal>
      <Modal
        title="权限绑定角色"
        visible={permission.bindVisible}
        onOk={() => this.handlePermissionBindRoleOk()}
        onCancel={() => this.handleUserCancel('permission', 'bindVisible')}
        width={1000}
        >
        <TableTransfer
          dataSource={permission.allRole}
          targetKeys={permission.myRole}
          showSearch
          onChange={nextTargetKeys => this.handleTableTransferChange('permission', 'myRole', nextTargetKeys)}
          filterOption={(inputValue, item) => item.name.indexOf(inputValue) !== -1}
          leftColumns={leftTableColumns}
          rightColumns={rightTableColumns}
        />
      </Modal>
      <Modal
        title="角色绑定用户"
        visible={role.roleBindVisible}
        onOk={() => this.handleRoleBindUserOk()}
        onCancel={() => this.handleUserCancel('role', 'roleBindVisible')}
        width={1000}
        >
        <TableTransfer
          dataSource={role.allUser}
          targetKeys={role.myUser}
          showSearch
          onChange={nextTargetKeys => this.handleTableTransferChange('role', 'myUser', nextTargetKeys)}
          filterOption={(inputValue, item) => item.name.indexOf(inputValue) !== -1}
          leftColumns={userLeftTableColumns}
          rightColumns={userRightTableColumns}
        />
      </Modal>
      </div>
    );
  }
}

export default PermissionManager;
