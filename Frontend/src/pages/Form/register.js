import React, { Component } from 'react';
import axios from 'axios';
// import { Redirect } from 'react-router-dom';
import {Form, Button, Select,Input, Upload, Icon, message} from 'antd';
import * as helpers from '../../utils/helpers';

import { Redirect } from 'react-router-dom';

const { Option } = Select;
const FormItem = Form.Item;
const baseURL = helpers.BACKEND_URL;


class Register extends Component{

    state = {
        confirmDirty: false,
        // flag:0
    };

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

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
    
    normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    regSuccess = () => {
        message.success('Register Success');
    };

    regFailure = () => {
        message.error('Register Failure');
    };

    handleSubmit = () => {
        let regInfo = this.props.form.getFieldsValue();
        const regURL = baseURL + '/auth/signup';
        const axiosConfig = {
            headers: {
                "accept": "application/json",
                'Content-Type':'application/json'
            }
        };
        const regData = {"username": regInfo.username, "password": regInfo.password, 
                        "email": regInfo.email, "phone": regInfo.phone}
        axios.post(regURL, regData, axiosConfig)
        .then((res) => {
            this.regSuccess()
            // this.setState({
            //     flag: 1
            // })
        }).catch(() => {
            this.regFailure()
        }); 
    }


    render(){
        console.log(this.state.flag)
        // if(this.state.flag){
        //     return <Redirect to='/login'/>
        // }
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { xs: 24, sm: 9, xl: 9 },
            wrapperCol: { xs: 16, sm: 9, xl: 6 }
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
                <Form layout="horizontal" style={{marginTop: 120, minHeight: 600}}>

                    <FormItem label="Upload" {...formItemLayout}>
                        {getFieldDecorator('upload', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                        })(
                            <Upload name="logo" action="/upload.do" listType="picture">
                                <Button style={{width: 180}}><Icon type="upload" /> Click to upload</Button>
                            </Upload>,
                        )}
                    </FormItem>

                    <FormItem label="UserName" {...formItemLayout}>
                        {
                            getFieldDecorator('username', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: 'Please input your Username!' },
                                    { max: 18, message:  "Username cannot be longer than 18 characters" },
                                    { pattern: new RegExp('^\\w+$', 'g'), message: 'Username can only contain digitals or letters!' }
                                ]
                            })( <Input allowClear/> )
                        }
                    </FormItem>
                    <FormItem label="Password" {...formItemLayout} hasFeedback>
                        {
                            getFieldDecorator('password', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: 'Please input your Password!' },
                                    { min: 6, max: 18, message: "Password must be between 6 and 18 characters!" },
                                    { validator: this.validateToNextPassword },
                                ]
                            })( <Input.Password /> )
                        }
                    </FormItem>
                    <FormItem label="Confirm Password" {...formItemLayout} hasFeedback>
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
                                    { required: true, message: 'Please input your Email!' },
                                    { type: 'email', message: 'The input is not a valid email!'},
                                ]
                            })( <Input allowClear/> )
                        }
                    </FormItem>
                    <FormItem label="Phone Number" {...formItemLayout}>
                        {
                            getFieldDecorator('phone', {
                                initialValue: '',
                                rules: [{ required: true, message: 'Please input your phone number!' }],
                            })(<Input addonBefore={prefixSelector}  allowClear/>)
                        }
                    </FormItem>
                    <FormItem style={{textAlign: "center"}}>
                        <Button type="primary" style={{marginTop: 50, fontSize: 16, fontWeight: 600}} onClick={this.handleSubmit}>Sign Up</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}


export default Form.create()(Register);



