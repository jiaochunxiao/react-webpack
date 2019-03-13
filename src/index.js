import React from 'react';
import ReactDOM from 'react-dom';
// // 由于 antd 组件的默认文案是英文，所以需要修改为中文
// import zhCN from 'antd/lib/locale-provider/zh_CN';
// import {Button, Menu, Dropdown, Icon, Table} from 'antd';
import {
    Form, DatePicker, Button, Input
} from 'antd';
const { RangePicker } = DatePicker;
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import './index.less';
class TimeRelatedForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            console.log(fieldsValue);
        })
    }
    handleChange(value) {
        console.log(value);
        this.props.form.setFieldsValue({
            'note': 'hello world'
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const rangeConfig = {
            rules: [{ type: 'array', required: true, message: 'Please select time!' }],
        };
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item
                    label="Note"
                >
                    {getFieldDecorator('note', {
                        rules: [{ required: true, message: 'Please input your note!' }],
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    label="RangePicker"
                >
                    {getFieldDecorator('range-picker', rangeConfig)(
                        <RangePicker onChange={this.handleChange.bind(this)} />
                    )}
                </Form.Item>
                <Button type="primary" htmlType="submit">Submit</Button>
            </Form>
        );
    }
}

const WrappedTimeRelatedForm = Form.create({ name: 'time_related_controls' })(TimeRelatedForm);
ReactDOM.render(<WrappedTimeRelatedForm />, document.getElementById('app'));

if (module.hot) {
    module.hot.accept();
}
