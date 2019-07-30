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
} from 'antd';

import style from './index.less';
import {
  queryFolder,
  modifyMount,
  deleteMount,
  addMount,
} from '../../services/manager';

const { Option } = Select;
const FormItem = Form.Item;

/* eslint-disable no-script-url */
@Form.create()
class FolderManager extends React.Component {
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
          <Popconfirm title={`是否删除${record.name}?`} onConfirm={() => this.handleActions('mount', 'delete', record)}
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
        parent: '',
      },
      mountData: [],
      mountVisible: false,
      isAdd: false,
    };
  }

  componentDidMount() {
    this.fetchMountList();
  }

  fetchMountList = () => {
    const { mount: { pageIndex, pageSize, key, parent } } = this.state;
    const parameters = {
      key,
      pageIndex,
      pageSize,
      parent,
    };
    queryFolder(parameters).then(res => {
      this.setState({ mountData: res.data });
    });
  }

  add = category => {
    const { form: { setFieldsValue } } = this.props;
    this.setState({ [`${category}Visible`]: true, isAdd: true });
    setFieldsValue({ name: '', sortNo: '' });
  }

  handleActions = (category, action, data) => {
    const { form: { setFieldsValue } } = this.props;
    const { name, sortNo, id } = data;
    if (action === 'delete') {
      this.deleteMountFunc(id);
    } else if (action === 'modify') {
      this.setState({ [`${category}Visible`]: true, [`${category}Id`]: id, isAdd: false });
      setFieldsValue({ name, sortNo });
    }
  }

  handleModalOk = category => {
    this.setState({ [`${category}Visible`]: false });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { name, sortNo } = values;
        const { mountId, isAdd } = this.state;

        const parameters = {
          name,
          state: sortNo,
        };
        if (!isAdd) {
          parameters.id = mountId;
          this.modifyFunc(parameters);
        } else {
          this.addMountFunc(parameters);
        }
      }
    });
  }

  modifyFunc = parameters => {
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

  hideModal = category => {
    this.setState({ [`${category}Visible`]: false });
  }

  render() {
    const {
      mountData,
      mountVisible,
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
    const { form: { getFieldDecorator } } = this.props;
    return (
      <div className={style.container}>
        <Button type="primary" onClick={() => this.add('mount')} className={style.btn}>新增挂载点</Button>
        <Table columns={this.columns} dataSource={mountData} bordered />
        <Modal
          title="挂载点"
          visible={mountVisible}
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
          <FormItem label="排序">
            {getFieldDecorator('sortNo', {
              rules: [{
                required: true, message: '请选择角色',
              }],
            })(
              <Select
                placeholder="请排序"
                style={{ width: '100%' }}
              >
              <Option value={0}>dev</Option>
              <Option value={1}>pro</Option>
              </Select>,
            )}
          </FormItem>
        </Form>
        </Modal>
      </div>
    );
  }
}

export default FolderManager;
