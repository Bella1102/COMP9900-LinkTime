import React, { Component } from 'react';
import moment from 'moment';
import {Form, Button, Select,Input, DatePicker, message, AutoComplete, } from 'antd';


const FormItem = Form.Item;
const TextArea = Input.TextArea;
const AutoCompleteOption = AutoComplete.Option;
const { Option } = Select;



class Register extends Component{

    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };

    handleSubmit = () => {
        let userInfo = this.props.form.getFieldsValue();
        message.success(`${userInfo.userName} Current Password is：${userInfo.userPwd}`)
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

    handleWebsiteChange = value => {
        let autoCompleteResult;
        if (!value) {
            autoCompleteResult = [];
        } else {
            autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
        }
        this.setState({ autoCompleteResult });
    };
    

    render(){
        
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;

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
            initialValue: '86',
          })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="61">+61</Option>
            </Select>,
        );

        const websiteOptions = autoCompleteResult.map(website => (
            <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        ));
      

        return (
            <div>
                <Form layout="horizontal" style={{marginTop: 100}}>
                    <FormItem label="UserName" {...formItemLayout}>
                        {
                            getFieldDecorator('userName', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: 'Please input your Username!' }
                                ]
                            })( <Input placeholder="Please input your username" /> )
                        }
                    </FormItem>
                    <FormItem label="Password" {...formItemLayout}>
                        {
                            getFieldDecorator('userPwd', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: 'Please input your Password!' }
                                ]
                            })( <Input.Password type="password" placeholder="Please input your password" /> )
                        }
                    </FormItem>
                    <FormItem label="Confirm Password" {...formItemLayout}>
                        {
                        getFieldDecorator('confirm', {
                            rules: [
                                { required: true, message: 'Please confirm your password!'},
                                { validator: this.compareToFirstPassword },
                            ],
                        })(<Input.Password onBlur={this.handleConfirmBlur} placeholder="Please confirm your password"/>)}
                    </FormItem>
                    <FormItem label="Email" {...formItemLayout}>
                        {
                            getFieldDecorator('userEmail', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: 'Please input your Email!' }
                                ]
                            })( <Input type="password" placeholder="Please input your email" /> )
                        }
                    </FormItem>
                    <FormItem label="Phone" {...formItemLayout}>
                        {
                            getFieldDecorator('userPhone', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: 'Please input your Phone Number!' }
                                ]
                            })( <Input type="password" placeholder="Please input your phone number" /> )
                        }
                    </FormItem>
                    <FormItem label="Address" {...formItemLayout}>
                        {
                            getFieldDecorator('address',{
                                initialValue: ''
                            })( <TextArea autoSize={{ minRows: 1, maxRows: 3 }} placeholder="Please input your address"/> )
                        }
                    </FormItem>
                    <FormItem label="Website" {...formItemLayout}>
                        {
                        getFieldDecorator('website', {
                            rules: [{ required: true, message: 'Please input website!' }],
                        })(
                            <AutoComplete dataSource={websiteOptions} 
                                          onChange={this.handleWebsiteChange}
                                          placeholder="website">
                            <Input />
                            </AutoComplete>,
                        )}
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
