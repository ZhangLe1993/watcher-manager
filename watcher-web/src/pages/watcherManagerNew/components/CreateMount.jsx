import { Form, Input, Modal, Select, Radio, TreeSelect, Icon, Popconfirm } from 'antd';
import React, { useState, useEffect } from 'react';

import styles from '../components/create.less';
import { queryParentNode } from '@/services/manager';

const FormItem = Form.Item;
const { Option } = Select;
const { TreeNode } = TreeSelect;

const CreateMount = props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    name,
    folderState,
    nodeId,
    nodeType,
    actionType,
    item,
    mountData,
  } = props;
  const {
    form: { setFieldsValue },
  } = props;
  const titles = { '1': '挂载点', '2': '文件夹', '3': '报表节点' };

  useEffect(() => {
    if (item.mount || item.mount === 0) {
      changeMountNode(item.nodeType === '3' ? '' : item.mount);
      if (actionType === 'update') {
        console.log(item.parentPosition);
        setFieldsValue({
          parentNode: item.parentPosition === '-1' ? '无' : item.parentPosition,
        });
      }
      if (actionType === 'add') {
        setFieldsValue({
          parentNode: item.position,
        });
      }
    }
  }, [item.mount]);

  const setTargetValueDisable = (position, data) => {
    for (let i = 0, len = data.length; i < len; i += 1) {
      const { children, value } = data[i];
      if (children.length === 0) {
        if (position === value) {
          // eslint-disable-next-line no-param-reassign
          data[i].disabled = true;
          break;
        }
      } else {
        setTargetValueDisable(position, children);
      }
    }
    return data;
  };

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.nodeType === '3' && !fieldsValue.mountPoint) {
        fieldsValue.mountPoint = item.mount;
      }
      handleAdd(fieldsValue);
      form.resetFields();
      handleModalVisible();
    });
  };

  const [treeData, setTreeData] = useState([]);
  const [nodeTypeState, setNodeTypeState] = useState(nodeType);

  let nodeIsRootInit = item && item.parentPosition === '-1' ? '1' : '2';
  const [nodeIsRoot, setNodeIsRoot] = useState(nodeIsRootInit); // 否

  const getMountList = () => {
    const children = [];
    for (let i = 0, len = mountData.length; i < len; i += 1) {
      children.push(
        <Option value={mountData[i].id} key={mountData[i].id}>
          {mountData[i].name}
        </Option>,
      );
    }
    return children;
  };

  const changeMountNode = (value, label, extra) => {
    queryParentNode(value).then(res => {
      if (actionType === 'update') {
        const temp = setTargetValueDisable(item.position, res);
        setTreeData(temp);
      }
      if (actionType === 'add') {
        setTreeData(res);
      }
    });
  };

  const nodeChange = e => {
    setNodeIsRoot(e.target.value);
  };
  const changeNodeType = e => {
    setNodeTypeState(e.target.value);
  };
  const checkUrlInput = (rule, value, callback) => {
    if (
      value !== undefined &&
      value !== null &&
      value.startsWith('https://abdavinci.aihuishou.com')
    ) {
      callback();
    } else {
      callback('达芬奇链接必须以https://abdavinci.aihuishou.com开头');
    }
  };
  return (
    <Modal
      destroyOnClose="true"
      title={titles[nodeType]}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 15,
        }}
        label="节点类型"
      >
        {form.getFieldDecorator('nodeType', {
          rules: [
            {
              required: true,
              message: '请选择节点类型',
            },
          ],
          initialValue: nodeType,
        })(
          <Radio.Group
            buttonStyle="solid"
            disabled={actionType === 'update'}
            onChange={e => changeNodeType(e)}
          >
            <Radio.Button value="1">挂载点</Radio.Button>
            <Radio.Button value="2">文件夹</Radio.Button>
            <Radio.Button value="3">报表节点</Radio.Button>
          </Radio.Group>,
        )}
      </FormItem>
      {// 文件夹
      nodeTypeState === '2' ? (
        <React.Fragment>
          <FormItem
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 15,
            }}
            label="挂载点"
          >
            {form.getFieldDecorator('mountPoint', {
              rules: [
                {
                  required: true,
                  message: '请选择挂载点！',
                },
              ],
              initialValue: item.mount || item.id,
            })(
              <Select
                style={{
                  width: '100%',
                }}
                onChange={(value, label, extra) => changeMountNode(value, label, extra)}
              >
                {getMountList()}
              </Select>,
            )}
          </FormItem>
          <FormItem
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 15,
            }}
            label="父节点"
          >
            {form.getFieldDecorator('parentNode', {})(
              <TreeSelect
                style={{ width: 295 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                showSearch
                treeNodeFilterProp="title"
                treeData={treeData}
                placeholder={item.parentPosition === '-1' ? '无' : ''}
              ></TreeSelect>,
            )}
          </FormItem>
        </React.Fragment>
      ) : null}
      {// 报表节点
      nodeTypeState === '3' ? (
        <React.Fragment>
          <FormItem
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 15,
            }}
            label="达芬奇地址"
          >
            {form.getFieldDecorator('url', {
              rules: [
                {
                  required: true,
                  message: '请输入地址！',
                },
                { validator: checkUrlInput },
              ],
              initialValue: item.url,
            })(<Input placeholder="请输入地址" />)}
          </FormItem>
          <FormItem
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 15,
            }}
            label="是否根节点"
          >
            {form.getFieldDecorator('isRoot', {
              initialValue: nodeIsRoot,
            })(
              <Radio.Group buttonStyle="solid" onChange={e => nodeChange(e)}>
                <Radio value="1">是</Radio>
                <Radio value="2">否</Radio>
              </Radio.Group>,
            )}
          </FormItem>
          {nodeIsRoot === '2' ? (
            <FormItem
              labelCol={{
                span: 5,
              }}
              wrapperCol={{
                span: 15,
              }}
              label="父节点"
            >
              {form.getFieldDecorator('parentNode', {})(
                <TreeSelect
                  style={{ width: 295 }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  showSearch
                  treeNodeFilterProp="title"
                  treeData={treeData}
                  placeholder={item.parentPosition === '-1' ? '无' : ''}
                ></TreeSelect>,
              )}
            </FormItem>
          ) : (
            <FormItem
              labelCol={{
                span: 5,
              }}
              wrapperCol={{
                span: 15,
              }}
              label="挂载点"
            >
              {form.getFieldDecorator('mountPoint', {
                rules: [
                  {
                    required: true,
                    message: '请选择挂载点！',
                  },
                ],
                initialValue: item.mount || item.id,
              })(
                <Select
                  style={{
                    width: '100%',
                  }}
                  onChange={(value, label, extra) => changeMountNode(value, label, extra)}
                >
                  {getMountList()}
                </Select>,
              )}
            </FormItem>
          )}
        </React.Fragment>
      ) : null}
      <FormItem
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 15,
        }}
        label="名称"
      >
        {form.getFieldDecorator('name', {
          rules: [
            {
              required: true,
              message: '请输入名称！',
            },
          ],
          initialValue: name,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 15,
        }}
        label="环境"
      >
        {form.getFieldDecorator('folderState', {
          rules: [
            {
              required: true,
              message: '请选择环境！',
            },
          ],
          initialValue: folderState,
        })(
          <Select
            style={{
              width: '100%',
            }}
          >
            <Option value="0">下线</Option>
            <Option value="1">上线</Option>
          </Select>,
        )}
      </FormItem>
      {form.getFieldDecorator('nodeId', {
        initialValue: nodeId,
      })(<Input placeholder="请输入" style={{ display: 'none' }} />)}
      <FormItem></FormItem>
    </Modal>
  );
};

export default Form.create()(CreateMount);
