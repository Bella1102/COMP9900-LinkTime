import React, { Component } from 'react';
import axios from 'axios';
import {Form, Button, Select,Input, message} from 'antd';


const FormItem = Form.Item;
const { Option } = Select;
const baseURL = 'http://127.0.0.1:5000';



class Register extends Component{

    state = {
        imgList: []
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
        axios.post(regURL, regData, axiosConfig).then((res) => {
            this.regSuccess()
        }).catch(() => {
            this.regFailure()
        }); 
    }


    render(){
        
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
                {/* <Alert message="Register Success" type="success" showIcon style={{ width: 200, marginLeft: 620, marginTop: 20, textAlign: "center"}}/> */}
                <Form layout="horizontal" style={{marginTop: 120, minHeight: 600}}>
                    {/* <FormItem label="Photo" {...formItemLayout}>
                        {
                            getFieldDecorator('photo')(
                                <Upload
                                    listType="picture-card"
                                    showUploadList={false}
                                    fileList={this.state.imgList}
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    onChange={this.handleChange}>
                                    {this.state.userImg ? <img src={this.state.userImg} alt=""/> : <Icon type="plus"/>}
                                </Upload>
                            )
                        }
                    </FormItem> */}
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
                                    { required: true, message: 'Please input your Password!' },
                                    { min: 6, max: 18, message: 'Password length is not valid!' }
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
                            })( <Input /> )
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
                    <FormItem style={{textAlign: "center"}}>
                        <Button type="primary" style={{marginTop: 50, fontSize: 16, fontWeight: 600}} onClick={this.handleSubmit}>Sign Up</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}


export default Form.create()(Register);
