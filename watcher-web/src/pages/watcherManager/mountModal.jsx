import React from 'react';
import {
  Modal,
  Input,
  Select,
} from 'antd';

const { Option } = Select;

class MountModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  render() {
    return (
      <Modal
        title="挂载点"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        >
        <div>
          <span style={{ display: 'inline-block', width: '100px', textAlign: 'right', marginRight: '12px' }}>挂载点</span>
          <Input style={{ width: 300 }} />
        </div>
        <div style={{ marginTop: '20px' }}>
          <span style={{ display: 'inline-block', width: '100px', textAlign: 'right', marginRight: '12px' }}>排序</span>
          <Select
            style={{ width: 300 }}
            placeholder="选择一个排序"
            >
            <Option value="0">dev</Option>
            <Option value="1">pro</Option>
          </Select>
        </div>
      </Modal>
    );
  }
}

export default MountModal;
