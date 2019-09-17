import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { connect } from 'dva';
import request from '@/utils/request';
import router from 'umi/router';
const { Option } = Select;

const flatData = data => {
    data = data.filter(it => !it.is_mount)
    if (data.length === 0) {
        return [];
    }
    let arr = [];
    let stack = [data[0]];
    while (stack.length > 0) {
        let top = stack[stack.length - 1];
        if (top.children && top.children.length) {
            stack.push(top.children[0]);
        } else {//到达叶子
            arr.push({ text: stack.map(it => it.name).join("/"), value: top.path })//结果收集
            if(arr.length>=20){//最多显示20个
                break;
            }
            //回溯
            while (true) {
                let pre = stack.pop();
                let siblings;
                if (stack.length === 0) {//到顶了
                    siblings = data;
                }else{
                    siblings = stack[stack.length - 1].children;
                }
                let nextIndex = siblings.indexOf(pre) + 1;
                if (nextIndex >= siblings.length) {
                    continue;//继续回溯
                } else {
                    stack.push(siblings[nextIndex]);//指向下一个兄弟节点
                    break;
                }
            }
        }
    }
    return arr;
};

class MenuSearchSelect extends React.Component {
    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.fetchUser = debounce(this.fetchUser, 800);
    }

    state = {
        data: [],
        value: [],
        fetching: false,
    };



    fetchUser = value => {
        console.log('fetching user', value);
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ data: [], fetching: true });
        request('/menu?key_word=' + value)
            .then(body => {
                if (fetchId !== this.lastFetchId) {
                    // for fetch callback order
                    return;
                }
                const data = flatData(body);
                this.setState({ data, fetching: false });
            });
    };

    handleChange = value => {
        this.setState({
            value,
            data: [],
            fetching: false,
        });
    };

    render() {
        const { fetching, data, value } = this.state;
        return (
            <Select
                mode="multiple"
                labelInValue
                placeholder="Select users"
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={this.fetchUser}
                onChange={this.handleChange}
                onSelect={(value,e)=>{
                    router.push(value.key)
                    return false;
                }}
                style={{ width: '70%' }}
            >
                {data.map(d => (
                    <Option key={d.value}>{d.text}</Option>
                ))}
            </Select>
        );
    }
}

export default connect()(MenuSearchSelect);