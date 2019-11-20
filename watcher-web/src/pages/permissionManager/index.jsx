/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-script-url */
import React from 'react';
import { Table, Divider, Popconfirm, message, Modal, Form, Input, Button, Transfer } from 'antd';
import difference from 'lodash/difference';

import style from './index.less';
import {
  addPermission,
  deletePermission,
  modifyPermission,
  queryPermission,
  queryAllPermission,
  queryBindPermission,
  userBindPermission,
  checkPermissionName,
  queryUser,
  authBindUser,
  getAuthBindUser,
  queryAllUser,
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
    title: '用户',
  },
];
const rightTableColumns = [
  {
    dataIndex: 'name',
    title: '用户',
  },
];

const userLeftTableColumns = [
  {
    dataIndex: 'name',
    title: '权限',
  },
];
const userRightTableColumns = [
  {
    dataIndex: 'name',
    title: '权限',
  },
];

@Form.create()
class PermissionManager extends React.Component {
  permissionColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: '60%',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={() => this.handleActions('permission', 'modify', record)}>
            修改
          </a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.handleActions('permission', 'bind', record)}>
            绑定用户
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title={`是否删除 ${record.name}?`}
            onConfirm={() => this.handleActions('permission', 'delete', record)}
            okText="确定"
            cancelText="取消"
          >
            <a href="javascript:;">删除</a>
          </Popconfirm>
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
          <a href="javascript:;" onClick={() => this.handleActions('user', 'bind', record)}>
            绑定权限
          </a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.handleActions('user', 'query', record)}>
            查看已绑定的权限
          </a>
        </span>
      ),
    },
  ];

  userBindPermissionColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
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
        userBindPermissionData: [],
        allPermission: [],
        myPermission: [],
        obId: null,
      },
    };
  }

  componentDidMount() {
    this.fetchPermissionList();
    this.fetchUserList();
  }

  handleActions = (type, action, data) => {
    console.log(type, action, data);
    const that = this;
    const {
      form: { setFieldsValue },
    } = this.props;
    const condition = `${type}-${action}`;
    switch (condition) {
      case 'permission-delete':
        this.deletePermissionFunc(data.id);
        break;
      case 'permission-modify':
      case 'permission-add':
        this.setState({
          permission: {
            ...that.state.permission,
            visible: true,
            id: data.id,
          },
        });
        // eslint-disable-next-line comma-dangle
        setFieldsValue({
          permissionName: data.name,
        });
        break;
      case 'permission-bind':
        this.setState({
          permission: {
            ...that.state.permission,
            bindVisible: true,
            id: data.id,
          },
        });
        this.getAuthBindUserFunc(data.id);
        this.authQueryAllUserFunc();
        break;
      case 'user-query':
        this.setState(
          {
            user: {
              ...that.state.user,
              queryVisible: true,
            },
          },
          () => {
            this.queryMyPermissionFunc(data.obId);
          },
        );
        break;
      case 'user-bind':
        this.setState(
          {
            user: {
              ...that.state.user,
              bindVisible: true,
              obId: data.obId,
            },
          },
          () => {
            this.queryAllPermissionFunc();
            this.queryMyPermissionFunc(data.obId);
          },
        );
        break;
      default:
        break;
    }
  };

  handlePageChange = (type, page, pageSize) => {
    console.log(type, page, pageSize);
    const category = type.substring(0, 1).toUpperCase() + type.substring(1);
    const that = this;
    this.setState(
      {
        [type]: {
          ...that.state[type],
          pageIndex: page,
          loading: true,
        },
      },
      () => {
        this[`fetch${category}List`]();
      },
    );
  };

  addPermissionFunc = parameters => {
    const that = this;
    addPermission(parameters).then(res => {
      if (res !== null && res.status !== undefined && res.status !== null && res.status !== 200) {
        return;
      }
      this.setState({
        permission: {
          ...that.state.permission,
          visible: false,
        },
      });
      message.success('新增用户权限成功!');
      this.fetchPermissionList();
    });
  };

  deletePermissionFunc = id => {
    const that = this;
    deletePermission(id).then(res => {
      if (res !== null && res.status !== undefined && res.status !== null && res.status !== 200) {
        return;
      }
      message.success('删除权限成功!');
      this.setState({
        permission: {
          ...that.state.permission,
          loading: true,
        },
      });
      this.fetchPermissionList();
    });
  };

  modifyPermissionFunc = parameters => {
    const that = this;
    modifyPermission(parameters).then(res => {
      if (res !== null && res.status !== undefined && res.status !== null && res.status !== 200) {
        return;
      }
      this.setState({
        permission: {
          ...that.state.permission,
          visible: false,
        },
      });
      message.success('修改用户权限成功!');
      this.fetchPermissionList();
    });
  };

  handlePermissionModalOk = () => {
    const that = this;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log(values, '--values--');
      const { permissionName } = values;
      checkPermissionName(permissionName).then(res => {
        console.log(res);
        // 不存在
        if (res !== undefined && res !== null && !res) {
          const { id } = that.state.permission;
          const parameters = {
            name: permissionName,
          };
          if (id) {
            parameters.id = id;
            this.modifyPermissionFunc(parameters);
          } else {
            this.addPermissionFunc(parameters);
          }
        } else {
          message.warning('权限名称已经存在或正在试图修改为自己!');
        }
      });
    });
  };

  fetchPermissionList = () => {
    const {
      permission: { pageIndex, pageSize, key },
    } = this.state;
    const that = this;
    const parameters = {
      key,
      pageIndex,
      pageSize,
    };
    queryPermission(parameters).then(res => {
      this.setState({
        permission: {
          ...that.state.permission,
          data: res.data,
          total: res.total,
          loading: false,
        },
      });
    });
  };

  fetchUserList = () => {
    const {
      user: { pageIndex, pageSize, key },
    } = this.state;
    const that = this;
    const parameters = {
      key,
      pageIndex,
      pageSize,
    };
    queryUser(parameters)
      .then(res => {
        this.setState({
          user: {
            ...that.state.user,
            data: res.data,
            total: res.total,
            loading: false,
          },
        });
      })
      .catch(e => {
        console.log(e, '-111--');
      });
  };

  /**
   * 用于穿梭框
   */
  queryAllPermissionFunc = () => {
    const that = this;
    queryAllPermission().then(res => {
      res.data.forEach(it => {
        it.key = it.id;
      });
      this.setState({
        user: {
          ...that.state.user,
          allPermission: res.data,
        },
      });
    });
  };

  getAuthBindUserFunc = operationId => {
    const that = this;
    // eslint-disable-next-line no-undef
    getAuthBindUser(operationId).then(res => {
      console.log(res, '--获取权限已经绑定的用户--');
      const userIds = res.map(it => it.obId);
      this.setState({
        permission: {
          ...that.state.permission,
          myUser: userIds,
        },
      });
    });
  };

  /**
   * 用于穿梭框
   * @param obId
   */
  queryMyPermissionFunc = obId => {
    const that = this;
    // eslint-disable-next-line no-undef
    queryBindPermission(obId).then(res => {
      console.log(res, '--获取用户已经绑定的权限--');
      const operationIds = res.map(it => it.id);
      /*const temp = [];

      const operations = res.map(it => {
        temp.push({ name: it });
        return it;
      });*/
      this.setState({
        user: {
          ...that.state.user,
          myPermission: operationIds,
          userBindPermissionData: res,
        },
      });
    });
  };

  authQueryAllUserFunc = () => {
    const that = this;
    queryAllUser().then(res => {
      console.log(res, '--所有用户--');
      res.data.forEach(it => {
        it.key = it.obId;
      });
      this.setState({
        permission: {
          ...that.state.permission,
          allUser: res.data,
        },
      });
    });
  };

  authBindUserFunc = parameters => {
    const that = this;
    authBindUser(parameters).then(res => {
      if (res !== null && res.status !== undefined && res.status !== null && res.status !== 200) {
        return;
      }
      message.success('权限绑定用户成功!');
      this.setState({
        permission: {
          ...that.state.permission,
          bindVisible: false,
        },
      });
      this.fetchPermissionList();
    });
  };

  bindPermissionFunc = parameters => {
    const that = this;
    userBindPermission(parameters).then(res => {
      if (res !== null && res.status !== undefined && res.status !== null && res.status !== 200) {
        return;
      }
      message.success('用户绑定权限成功!');
      this.setState({
        user: {
          ...that.state.user,
          bindVisible: false,
        },
      });
      this.fetchUserList();
    });
  };

  handleCancel = type => {
    const that = this;
    this.setState({
      [type]: {
        ...that.state[type],
        visible: false,
      },
    });
  };

  handleUserCancel = (type, key) => {
    const that = this;
    this.setState({
      [type]: {
        ...that.state[type],
        [key]: false,
      },
    });
  };

  handleSearchInputChange = (e, type) => {
    const that = this;
    this.setState({
      [type]: {
        ...that.state[type],
        key: e.target.value,
      },
    });
  };

  handleTableTransferChange = (type, key, nextTargetKeys) => {
    const that = this;
    this.setState({
      [type]: {
        ...that.state[type],
        [key]: nextTargetKeys,
      },
    });
  };

  handleSearch = type => {
    const category = type.substring(0, 1).toUpperCase() + type.substring(1);
    const that = this;
    this.setState(
      {
        [type]: {
          ...that.state[type],
          pageIndex: 1,
          loading: true,
        },
      },
      () => {
        this[`fetch${category}List`]();
      },
    );
  };

  handleUserOk = () => {
    const {
      user: { myPermission, obId },
    } = this.state;
    const parameters = {
      operationIds: myPermission,
      ob: obId,
    };
    /* if (Array.isArray(myPermission) && myPermission.length === 0) {
      return message.error('请至少选择一个角色!');
    } */
    this.bindPermissionFunc(parameters);
  };

  handlePermissionBindUserOk = () => {
    const {
      permission: { myUser, id },
    } = this.state;
    const parameters = {
      operationId: id,
      ids: myUser,
    };
    /* if (Array.isArray(myUser) && myUser.length === 0) {
      return message.error('请至少选择一个用户!');
    */
    this.authBindUserFunc(parameters);
    console.log(this.state.permission, '--permission-');
  };

  render() {
    const { permission, user } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const permissionPagination = {
      pageSize: permission.pageSize,
      total: permission.total,
      showQuickJumper: true,
      hideOnSinglePage: true,
      current: permission.pageIndex,
      onChange: (page, pageSize) => this.handlePageChange('permission', page, pageSize),
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
          <Input
            placeholder="请输入关键字"
            className={style.search}
            onChange={e => this.handleSearchInputChange(e, 'user')}
          />
          <Button type="primary" onClick={() => this.handleSearch('user')}>
            搜索用户
          </Button>
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
            <Button
              type="primary"
              onClick={() => this.handleActions('permission', 'add', permissionAdd)}
            >
              增加用户权限
            </Button>
          </div>
          <div className={style.searchWrapper}>
            <Input
              placeholder="请输入关键字"
              className={style.search}
              onChange={e => this.handleSearchInputChange(e, 'permission')}
            />
            <Button type="primary" onClick={() => this.handleSearch('permission')}>
              搜索用户权限
            </Button>
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
          onOk={() => this.handlePermissionModalOk('permission')}
          onCancel={() => this.handleCancel('permission')}
        >
          <Form {...formItemLayout}>
            <FormItem label="名称">
              {getFieldDecorator('permissionName', {
                rules: [
                  {
                    required: true,
                    message: '请输入名称',
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="用户绑定权限"
          visible={user.bindVisible}
          onOk={() => this.handleUserOk()}
          onCancel={() => this.handleUserCancel('user', 'bindVisible')}
          width={1000}
        >
          <TableTransfer
            dataSource={user.allPermission}
            targetKeys={user.myPermission}
            showSearch
            onChange={nextTargetKeys =>
              this.handleTableTransferChange('user', 'myPermission', nextTargetKeys)
            }
            filterOption={(inputValue, item) => item.name.indexOf(inputValue) !== -1}
            leftColumns={userLeftTableColumns}
            rightColumns={userRightTableColumns}
          />
        </Modal>
        <Modal
          title="已绑定的权限"
          visible={user.queryVisible}
          onOk={() => this.handleUserCancel('user', 'queryVisible')}
          onCancel={() => this.handleUserCancel('user', 'queryVisible')}
          width={1000}
        >
          <Table
            columns={this.userBindPermissionColumns}
            dataSource={user.userBindPermissionData}
            bordered
            // pagination={rolePagination}
            // loading={user.loading}
          />
        </Modal>
        <Modal
          title="权限绑定用户"
          visible={permission.bindVisible}
          onOk={() => this.handlePermissionBindUserOk()}
          onCancel={() => this.handleUserCancel('permission', 'bindVisible')}
          width={1000}
        >
          <TableTransfer
            dataSource={permission.allUser}
            targetKeys={permission.myUser}
            showSearch
            onChange={nextTargetKeys =>
              this.handleTableTransferChange('permission', 'myUser', nextTargetKeys)
            }
            filterOption={(inputValue, item) => item.name.indexOf(inputValue) !== -1}
            leftColumns={leftTableColumns}
            rightColumns={rightTableColumns}
          />
        </Modal>
      </div>
    );
  }
}

export default PermissionManager;
