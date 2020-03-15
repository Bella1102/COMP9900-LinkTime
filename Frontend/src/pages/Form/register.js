import React, { Component } from 'react';
import {Form, Button, Select,Input, message } from 'antd';


const FormItem = Form.Item;
const TextArea = Input.TextArea;
const { Option } = Select;



class Register extends Component{

    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };

    handleSubmit = () => {
        let userInfo = this.props.form.getFieldsValue();
        message.success(`${userInfo.username} Current Password is：${userInfo.password}`)
    }

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
            callback();
      };

    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, imageUrl => this.setState({
                userImg: imageUrl,
                loading: false,
            }));
        }
    }

    render(){
        
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { xs: 24, sm: 9, xl: 9 },
            wrapperCol: { xs: 16, sm: 9, xl: 6 }
        }

        const offsetLayout = {
            wrapperCol: { xs: { span: 6, offset: 10 }, 
                          sm: { span: 6, offset: 10 }, 
                          xl: { span: 6, offset: 10 }  }
        }

        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '61',
          })(
            <Select style={{ width: 70 }}>
                <Option value="61">+61</Option>
                <Option value="86">+86</Option>
            </Select>,
        );
      
        return (
            <div>
                <Form layout="horizontal" style={{marginTop: 100}}>
                    <FormItem label="UserName" {...formItemLayout}>
                        {
                            getFieldDecorator('username', {
                                initialValue: '',
                                rules: [{ required: true, message: 'Please input your Username!' }]
                            })( <Input /> )
                        }
                    </FormItem>
                    <FormItem label="Password" {...formItemLayout}>
                        {
                            getFieldDecorator('password', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: 'Please input your Password!' }
                                ]
                            })( <Input.Password type="password" /> )
                        }
                    </FormItem>
                    <FormItem label="Confirm Password" {...formItemLayout}>
                        {
                        getFieldDecorator('confirm', {
                            rules: [
                                { required: true, message: 'Please confirm your password!'},
                                { validator: this.compareToFirstPassword },
                            ],
                        })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                    </FormItem>
                    <FormItem label="Email" {...formItemLayout}>
                        {
                            getFieldDecorator('email', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: 'Please input your Email!' }
                                ]
                            })( <Input type="password" /> )
                        }
                    </FormItem>
                    <FormItem label="Phone Number" {...formItemLayout}>
                        {
                            getFieldDecorator('phone', {
                                initialValue: '',
                                rules: [{ required: true, message: 'Please input your phone number!' }],
                            })(<Input addonBefore={prefixSelector} />)
                        }
                    </FormItem>
                    <FormItem label="Address" {...formItemLayout}>
                        {
                            getFieldDecorator('address',{
                                initialValue: ''
                            })( <TextArea autoSize={{ minRows: 1, maxRows: 3 }}/> )
                        }
                    </FormItem>
                    <FormItem {...offsetLayout}>
                        <Button type="primary" onClick={this.handleSubmit}>Sign up</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}


export default Form.create()(Register);
