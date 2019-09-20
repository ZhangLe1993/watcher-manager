import React, { Component } from 'react';
import {
  Tree,
  Icon,
  Popconfirm,
  message,
  Modal,
  Transfer,
  Table,
  Spin,
  Card,
  Divider,
  Input,
  InputNumber,
} from 'antd';
import styles from './index.less';
import Button from 'antd/es/button';
import CreateMount from '@/pages/watcherManagerNew/components/CreateMount';
import {
  addFolder,
  addMount,
  addNode,
  clear,
  clearAll,
  deleteFolder,
  deleteMount,
  deleteNode,
  doMenuAuth,
  folderSort,
  modifyFolder,
  modifyMount,
  modifyNode,
  mountSort,
  nodeSort,
  queryAllAuth,
  queryAllParentNode,
  queryFolder,
  queryMount,
  queryNode,
  queryParentNode,
  queryUserAuth,
} from '@/services/manager';
import difference from 'lodash/difference';

const { TreeNode } = Tree;
const { Search } = Input;

class WatcherManagerNew extends Component {
  constructor(props) {
    super(props);
    this.sortNoInput = React.createRef();
  }
  data = [];

  mountData = [];

  folderData = [];

  nodeData = [];

  expandedKeys = [];

  state = {
    loading: true,
    mountDataReady: false,
    folderDataReady: false,
    nodeDataReady: false,
    sortNoShow: false,
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    data: this.data,
    createMountVisible: false,
    updateMountValues: {
      name: '',
      folderState: '',
      nodeId: '',
      nodeType: '1', // 1 挂载点 2 文件夹  3 子节点
      actionType: '',
      mountData: [],
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

  componentDidMount() {
    // eslint-disable-next-line max-len
    // Tip: Must have, or the parent node will not expand automatically when you first add a child node
    this.onExpand([]); // 手动触发，否则会遇到第一次添加子节点不展开的Bug
    this.loadTreeData();
  }

  loadTreeData = () => {
    this.mountData = [];
    this.folderData = [];
    this.nodeData = [];
    this.setState({
      loading: true,
      mountDataReady: false,
      folderDataReady: false,
      nodeDataReady: false,
    });
    this.fetchMountList();
    this.fetchFolderList();
    this.fetchNodeList();

    this.checkDataReady();
  };

  checkDataReady = () => {
    let that = this;
    this.state.interval = setInterval(function() {
      if (that.state.mountDataReady && that.state.folderDataReady && that.state.nodeDataReady) {
        that.generateTreeNode(that.mountData);
        clearInterval(that.state.interval);
        that.setState({
          data: that.mountData,
          loading: false,
        });
      }
    }, 500);
    // 最多等待6s
    setTimeout(function() {
      clearInterval(that.state.interval);
      that.setState({
        loading: false,
      });
    }, 6000);
  };

  generateTreeNode = (treeData, node) => {
    if (!treeData) {
      return;
    }
    if (node) {
      for (let i = 0; i < treeData.length; i++) {
        if (node.parentPosition === treeData[i].position) {
          if (!treeData[i].children) {
            treeData[i].children = [];
          }
          treeData[i].children.push(node);
        } else {
          if (!treeData[i].children) {
            treeData[i].children = [];
          }
          this.generateTreeNode(treeData[i].children, node);
        }
      }
    } else {
      for (let i = 0; i < treeData.length; i++) {
        for (let j = 0; j < this.folderData.length; j++) {
          if (this.folderData[j].mount === treeData[i].id) {
            if (!treeData[i].children) {
              treeData[i].children = [];
            }
            if (this.folderData[j].parentPosition === '-1') {
              treeData[i].children.push(this.folderData[j]);
            } else {
              this.generateTreeNode(treeData[i].children, this.folderData[j]);
            }
          }
        }

        for (let k = 0; k < this.nodeData.length; k++) {
          if (this.nodeData[k].parentPosition === '-1') {
            //根节点 bug
            if (treeData[i].id === this.nodeData[k].mount) {
              treeData[i].children.push(this.nodeData[k]);
            }
          } else {
            this.generateTreeNode(treeData[i].children, this.nodeData[k]);
          }
        }
      }
    }
  };

  fetchMountList = () => {
    const that = this;
    const parameters = {
      key: '',
      pageIndex: 1,
      pageSize: 10,
    };
    queryMount(parameters).then(res => {
      res.data.forEach(it => {
        // eslint-disable-next-line no-param-reassign
        it.key = it.id;
        it.isEdit = false;

        this.mountData.push({
          ...it,
          value: it.id,
          defaultValue: it.name,
          key: it.id,
          nodeType: '1',
          parentKey: '0',
        });
      });
      this.mountData.sort(function(a, b) {
        return a.sortNo - b.sortNo;
      });
      this.setState({
        mountDataReady: true,
      });
    });
  };

  fetchFolderList = pageIndex => {
    const that = this;
    const parameters = {
      key: '',
      pageIndex: 1,
      pageSize: 9999,
      parent: '',
    };
    queryFolder(parameters).then(res => {
      res.data.forEach(it => {
        it.key = it.id;
        it.isEdit = false;
        that.folderData.push({
          ...it,
          value: it.id,
          defaultValue: it.name,
          key: it.mount + '-' + it.id,
          nodeType: '2',
          parentKey: it.mount,
        });
      });
      this.folderData.sort(function(a, b) {
        return a.sortNo - b.sortNo;
      });
      this.setState({
        folderDataReady: true,
      });
    });
  };

  fetchNodeList = () => {
    const that = this;
    const parameters = {
      key: '',
      pageIndex: 1,
      pageSize: 9999,
      parent: '',
    };
    queryNode(parameters).then(res => {
      res.data.forEach(it => {
        // eslint-disable-next-line no-param-reassign
        it.key = it.id;
        it.isEdit = false;

        that.nodeData.push({
          ...it,
          value: it.id,
          auth: it.auth ? it.auth : 'auth',
          defaultValue: it.name,
          nodeType: '3',
          key: it.mount + '-' + it.id,
          parentKey: it.mount,
        });
      });
      this.nodeData.sort(function(a, b) {
        return a.sortNo - b.sortNo;
      });
      this.setState({
        nodeDataReady: true,
      });
    });
  };

  handleModalVisible = (flag, item, actionType) => {
    console.log(item);
    if (item) {
      if (actionType === 'update') {
        this.setState({
          updateMountValues: {
            name: item.name,
            folderState: item.state,
            nodeId: item.id,
            nodeType: item.parentKey === '0' ? '1' : item.auth ? '3' : '2',
            actionType: actionType,
            item: item,
            mountData: this.mountData,
          },
          createMountVisible: !!flag,
        });
      }
      if (actionType === 'add') {
        this.setState({
          updateMountValues: {
            name: '',
            folderState: '',
            nodeId: '',
            nodeType: item.parentKey === '0' ? '1' : item.auth ? '3' : '2',
            actionType: actionType,
            item: item,
            mountData: this.mountData,
          },
          createMountVisible: !!flag,
        });
      }
    } else {
      this.setState({
        updateMountValues: {
          name: '',
          folderState: '',
          nodeId: '',
          nodeType: '1',
          actionType: '',
          item: {},
          mountData: this.mountData,
        },
        createMountVisible: !!flag,
      });
    }
  };

  handleMountAdd = fieldsValue => {
    console.log('handleAdd:-->', fieldsValue);
    if (!fieldsValue.nodeKey) {
      if (fieldsValue.nodeType === '1') {
        // 挂载点
        this.addMountAjax(fieldsValue);
      }
      if (fieldsValue.nodeType === '2') {
        // 文件夹
        this.addFolderAjax(fieldsValue);
      }
      if (fieldsValue.nodeType === '3') {
        // 报表节点
        this.addNodeAjax(fieldsValue);
      }
    } else {
      this.editMountNode(fieldsValue.nodeKey, this.mountData, fieldsValue);
    }
    // 隐藏弹出层
    this.setState({
      createMountVisible: true,
    });
  };
  /**
   * 重新加载树
   */
  reload = () => {
    this.loadTreeData();
  };
  /**
   * 请求后端添加挂载点
   * @param fieldsValue
   */
  addMountAjax = fieldsValue => {
    let parameters = { name: fieldsValue.name, state: fieldsValue.folderState };
    if (fieldsValue.nodeId) {
      //id存在  修改
      parameters.id = fieldsValue.nodeId;
      modifyMount(parameters).then(() => {
        message.success('修改成功');
        this.reload();
      });
    } else {
      addMount(parameters).then(() => {
        message.success('新增成功');
        this.reload();
      });
    }
  };
  /**
   * 请求后端添加、修改文件夹
   * @param fieldsValue
   */
  addFolderAjax = fieldsValue => {
    let parameters = {
      name: fieldsValue.name,
      mount: fieldsValue.mountPoint,
      parentPosition: fieldsValue.parentNode === '无' ? '-1' : fieldsValue.parentNode,
      state: fieldsValue.folderState,
    };
    if (fieldsValue.nodeId) {
      //id存在  修改
      parameters.id = fieldsValue.nodeId;
      modifyFolder(parameters).then(() => {
        message.success('修改成功');
        this.reload();
      });
    } else {
      addFolder(parameters).then(() => {
        message.success('新增成功');
        this.reload();
      });
    }
  };
  /**
   * 请求后端添加、修改报表节点
   * @param fieldsValue
   */
  addNodeAjax = fieldsValue => {
    let parameters = {
      name: fieldsValue.name,
      mount: fieldsValue.mountPoint,
      url: fieldsValue.url,
      state: fieldsValue.folderState,
    };
    if (fieldsValue.nodeId) {
      //id存在  修改
      parameters.id = fieldsValue.nodeId;
      if (fieldsValue.parentNode) {
        parameters.parentPosition = fieldsValue.parentNode;
      }
      modifyNode(parameters).then(() => {
        message.success('修改成功');
        this.reload();
      });
    } else {
      if (fieldsValue.parentNode) {
        parameters.parentPosition = fieldsValue.parentNode;
      } else {
        parameters.parentPosition = '-1';
      }
      addNode(parameters).then(() => {
        message.success('新增成功');
        this.reload();
      });
    }
  };
  /**
   * 请求后端删除挂载点
   * @param fieldsValue
   */
  delMountAjax = (id, item) => {
    if (item.children.length > 0) {
      message.error('存在子节点,不能删除');
    } else {
      deleteMount(id).then(() => {
        message.success('删除成功');
        this.reload();
      });
    }
  };
  /**
   * 请求后端删除文件夹
   * @param fieldsValue
   */
  delFolderAjax = (id, item) => {
    if (item.children.length > 0) {
      message.error('存在子节点,不能删除');
    } else {
      deleteFolder(id).then(() => {
        message.success('删除成功');
        this.reload();
      });
    }
  };
  /**
   * 请求后端删除报表节点
   * @param fieldsValue
   */
  delNodeAjax = id => {
    deleteNode(id).then(() => {
      message.success('删除成功');
      this.reload();
    });
  };
  // mount排序
  mountSortFunc = params => {
    mountSort([params]).then(() => {
      message.success('修改挂载点顺序成功!');
      this.reload();
    });
  };

  // folder排序
  folderSortFunc = params => {
    folderSort([params]).then(() => {
      message.success('修改文件夹顺序成功!');
      this.reload();
    });
  };

  // node排序
  nodeSortFunc = params => {
    nodeSort([params]).then(() => {
      message.success('修改报表节点顺序成功!');
      this.reload();
    });
  };

  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    this.expandedKeys = expandedKeys;
    this.setState({ expandedKeys });
  };
  renderSearchValve = item => {
    const index = item.name.indexOf(this.state.searchValue);
    const beforeStr = item.name.substr(0, index);
    const afterStr = item.name.substr(index + this.state.searchValue.length);
    const title = (
      <span>
        {beforeStr}
        <span style={{ color: '#f50' }}>{this.state.searchValue}</span>
        {afterStr}
      </span>
    );
    return title;
  };

  renderSortInput = item => {
    return (
      <span>
        {item.name}:<br />
        <InputNumber min={0} defaultValue={item.sortNo} ref={this.sortNoInput} />
      </span>
    );
  };

  showSortNo = flag => {
    this.setState({
      sortNoShow: !!flag,
    });
  };

  sortTreeNode = treeNode => {
    let sortNo = this.sortNoInput.current.inputNumberRef.currentValue;
    switch (treeNode.nodeType) {
      case '1':
        this.mountSortFunc({ id: treeNode.id, sortNo: sortNo });
        break;
      case '2':
        this.folderSortFunc({ id: treeNode.id, sortNo: sortNo });
        break;
      case '3':
        this.nodeSortFunc({ id: treeNode.id, sortNo: sortNo });
        break;
    }
  };

  renderTreeNodes = data =>
    data.map((item, index) => {
      item.title = (
        <div className={styles.titleContainer}>
          <span
            style={
              this.state.sortNoShow
                ? { display: '', color: '#ff0000', width: 25 }
                : { display: 'none', width: 25 }
            }
          >
            {item.sortNo}-
          </span>
          <span>
            {item.parentKey === '0' ? (
              <Icon style={{ marginRight: 10 }} type="tags" theme="twoTone" />
            ) : item.auth ? (
              <Icon style={{ marginRight: 10 }} type="api" theme="twoTone" />
            ) : (
              <Icon style={{ marginRight: 10 }} type="folder" theme="twoTone" />
            )}
            {item.name.indexOf(this.state.searchValue) > -1
              ? this.renderSearchValve(item)
              : item.name}
          </span>

          <span className={styles.operationField}>
            <Icon
              style={{ marginLeft: 10 }}
              type="edit"
              onClick={() => this.handleModalVisible(true, item, 'update')}
              title="编辑"
            />
            {item.auth ? (
              <Icon
                style={{ marginLeft: 10 }}
                type="lock"
                onClick={() => this.handleEmpowerment(item.position)}
                title="赋权"
              />
            ) : (
              <Icon
                style={{ marginLeft: 10 }}
                type="plus"
                onClick={() => this.handleModalVisible(true, item, 'add')}
                title="添加"
              />
            )}
            <Popconfirm
              title={`是否删除${item.name}?`}
              onConfirm={() => this.onDelete(item)}
              okText="确定"
              cancelText="取消"
            >
              <Icon style={{ marginLeft: 10, marginRight: 10 }} type="minus" title="删除" />
            </Popconfirm>
            <Divider type="vertical" />

            <Popconfirm
              placement="right"
              destroyTooltipOnHide
              title={this.renderSortInput(item)}
              okText="Yes"
              cancelText="No"
              okText="确定"
              cancelText="取消"
              onVisibleChange={visible => this.setState({ sortNoShow: visible })}
              onConfirm={e => this.sortTreeNode(item)}
              icon={<Icon type="sort-ascending" title="排序" />}
            >
              <Icon type="sort-ascending" title="排序" onClick={() => this.showSortNo(true)} />
            </Popconfirm>
          </span>
        </div>
      );

      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item} icon={<Icon type="edit" />}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }

      return <TreeNode {...item} />;
    });

  onDelete = item => {
    console.log('delete', item);
    if (item.auth) {
      //报表节点
      this.delNodeAjax(item.id);
    } else if (item.parentKey === '0') {
      // 挂载点
      this.delMountAjax(item.id, item);
    } else {
      //文件夹
      this.delFolderAjax(item.id, item);
    }
  };

  deleteNode = (key, data) =>
    data.map((item, index) => {
      if (item.key === key) {
        data.splice(index, 1);
      } else if (item.children) {
        this.deleteNode(key, item.children);
      }
    });

  findNode = (key, data) =>
    data.map((item, index) => {
      if (item.key === key) {
        console.log(item);
      } else if (item.children) {
        this.findNode(key, item.children);
      }
    });

  editMountNode = (key, data, fieldsValue) =>
    data.map(item => {
      if (item.key === key) {
        console.log(item);
        item.value = fieldsValue.name;
        item.name = fieldsValue.name;
        item.defaultValue = fieldsValue.name;
        item.state = fieldsValue.folderState;
      }
      if (item.children) {
        this.editMountNode(key, item.children, fieldsValue);
      }
    });

  changeNode = (key, value, data) =>
    data.map(item => {
      if (item.key === key) {
        item.value = value;
      }
      if (item.children) {
        this.changeNode(key, value, item.children);
      }
    });

  handleEmpowerment = position => {
    const that = this;
    this.setState(
      {
        authority: {
          ...that.state.authority,
          visible: true,
          loading: true,
          position,
        },
      },
      () => {
        this.getUserAuth(position);
        this.getAllAuth();
      },
    );
  };

  getUserAuth = position => {
    const that = this;
    queryUserAuth(position).then(res => {
      this.setState({
        authority: {
          ...that.state.authority,
          userAuth: res,
        },
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
        },
      });
    });
  };

  hideAuthModal = () => {
    const that = this;
    this.setState({
      authority: {
        ...that.state.authority,
        visible: false,
      },
    });
  };

  handleAuthUpdate = () => {
    const that = this;
    this.setState(
      {
        authority: {
          ...that.state.authority,
          visible: false,
          modalLoading: true,
        },
      },
      () => {
        this.doMenuAuthFunc();
      },
    );
  };
  handleSelectedAuth = nextTargetKeys => {
    const that = this;
    this.setState({
      authority: {
        ...that.state.authority,
        userAuth: nextTargetKeys,
      },
    });
  };
  doMenuAuthFunc = () => {
    const { position, userAuth } = this.state.authority;
    const that = this;
    const parameters = {
      position,
      auth: userAuth,
    };
    doMenuAuth(parameters).then(() => {
      message.success('菜单赋权成功!');
      this.setState({
        authority: {
          ...that.state.authority,
          modalLoading: false,
        },
      });
    });
  };

  getParentKey = (value, tree, keysStore) => {
    tree.map((item, index) => {
      if (item.name.indexOf(value) > -1) {
        keysStore.push(item.key);
      } else {
        if (item.children) {
          this.getParentKey(value, item.children, keysStore);
        }
      }
    });
  };

  searchInputChange = e => {
    let $this = this;
    let value = e.target.value;
    clearTimeout(this.state.searchTimeout);
    this.state.searchTimeout = setTimeout(function() {
      if (!value.trim()) {
        $this.setState({
          expandedKeys: [],
          searchValue: '',
        });
        return;
      }
      let expandedKeys = [];
      $this.getParentKey(value.trim(), $this.state.data, expandedKeys);
      $this.setState({
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      });
    }, 500);
  };

  handleClear = type => {
    if (type === 'all') {
      this.clearAllFunc();
    } else if (type === 'standard') {
      this.clearFunc();
    }
  };

  clearAllFunc = () => {
    clearAll()
      .then(() => {
        message.success('全部清除成功!');
      })
      .catch(e => {
        message.error(e);
      });
  };

  clearFunc = () => {
    clear()
      .then(() => {
        message.success('标准清除成功!');
      })
      .catch(e => {
        message.error(e);
      });
  };

  onNodeDrop = ({ event, node, dragNode, dragNodesKeys }) => {
    console.log('node', node);
    console.log('dragNode', dragNode);
    console.log('dragNodesKeys', dragNodesKeys);
  };

  render() {
    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      handleAdd: this.handleMountAdd,
    };
    const { authority } = this.state;

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
    return (
      <Card style={{ height: window.innerHeight - 110 }}>
        <Button
          type="primary"
          onClick={() => this.handleModalVisible(true, undefined)}
          className={styles.addMountBtn}
        >
          新增
        </Button>
        <Button
          onClick={() => this.reload()}
          style={{ marginLeft: 15 }}
          loading={this.state.loading}
        >
          刷新
        </Button>
        <Divider type="vertical" />
        <Button type="primary" onClick={() => this.handleClear('all')} style={{ marginRight: 15 }}>
          全部清除
        </Button>
        <Button type="primary" onClick={() => this.handleClear('standard')}>
          标准清除
        </Button>
        <Divider type="vertical" />
        <span>
          <Icon style={{ marginRight: 10, marginLeft: 15 }} type="tags" theme="twoTone" /> 挂载点
          <Icon style={{ marginRight: 10, marginLeft: 15 }} type="folder" theme="twoTone" /> 文件夹
          <Icon style={{ marginRight: 10, marginLeft: 15 }} type="api" theme="twoTone" /> 报表节点
        </span>
        <Divider />

        <Search
          style={{ marginBottom: 8, width: '50%' }}
          placeholder="Search"
          onChange={this.searchInputChange}
        />
        <Spin spinning={this.state.loading} tip="Loading...">
          <Tree
            expandedKeys={this.state.expandedKeys}
            selectedKeys={[]}
            onExpand={this.onExpand}
            onDrop={this.onNodeDrop}
            autoExpandParent={this.state.autoExpandParent}
            style={{ width: '50%', height: '100%' }}
          >
            {this.renderTreeNodes(this.state.data)}
          </Tree>
        </Spin>
        {this.state.createMountVisible ? (
          <CreateMount
            {...parentMethods}
            {...this.state.updateMountValues}
            modalVisible={this.state.createMountVisible}
          />
        ) : null}

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
      </Card>
    );
  }
}

export default WatcherManagerNew;
