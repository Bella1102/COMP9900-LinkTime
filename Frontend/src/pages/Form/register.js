import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import {Form, Button, Select,Input, Upload, Icon, Modal, message} from 'antd';
import { postConfig } from '../../redux/oneStore/actionCreators';
import * as helpers from '../../utils/helpers';

const { Option } = Select;
const FormItem = Form.Item;
const baseURL = helpers.BACKEND_URL;
const actionURL = baseURL + "/upload/"


class Register extends Component{

    state = {
        confirmDirty: false,
        regFlag: 0,
        previewVisible: false,
        previewImage: '',
        fileList: []
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

    regSuccess = () => {
        message.success('Register Success, Please Login!');
    };

    regFailure = (err) => {
        message.error('Register Failure: ' + err);
    };

    handleSubmit = () => {
        const regURL = baseURL + '/auth/signup';

        this.props.form.validateFields((err, values) => {
            if (!err) {
                let avatar = this.state.fileList[0]['name']
                const regData = {"username": values.username, "password": values.password, 
                    "email": values.email, "phone": values.phone, "avatar": avatar}

                axios.post(regURL, regData, postConfig).then((res) => {
                    this.regSuccess()
                    this.setState({regFlag: 1})
                }).catch((error) => {
                    this.regFailure(error.response.data.message)
                }); 
            }  
        })
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handleChange = ({ fileList }) => this.setState({ fileList });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };


    render(){
        const { getFieldDecorator } = this.props.form;
        const { previewVisible, previewImage, fileList } = this.state;

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

        if (this.state.regFlag){
            return (<Redirect to="/login" />)
        }
        return (
            <div>
                <Form layout="horizontal" style={{marginTop: 120, minHeight: 600}}>
                    <FormItem label="Profile" {...formItemLayout}>
                        {getFieldDecorator('upload', {
                            initialValue: [],
                            rules: [{ required: true }]
                        })(<div className="clearfix">
                                <Upload
                                        action={actionURL}
                                        listType="picture"
                                        fileList={fileList}
                                        onPreview={this.handlePreview}
                                        onChange={this.handleChange}
                                    >
                                    {
                                        fileList.length === 0 ? 
                                        <Button style={{backgroundColor: "#f0f0f0", width: 180}}>
                                            <Icon type="upload" />
                                            Upload Profile
                                        </Button> : null
                                    }
                                </Upload>
                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                    <img style={{ width: '100%' }} src={previewImage} alt="photos"/>
                                </Modal>
                            </div>
                        )}
                    </FormItem>

                    <FormItem label="UserName" {...formItemLayout}>
                        {
                            getFieldDecorator('username', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: 'Please input your Username' },
                                    { max: 18, message:  "Username cannot be longer than 18 characters" },
                                    { pattern: new RegExp('^\\w+$', 'g'), message: 'Username can only contain digitals or letters' }
                                ]
                            })( <Input allowClear/> )
                        }
                    </FormItem>
                    <FormItem label="Password" {...formItemLayout} hasFeedback>
                        {
                            getFieldDecorator('password', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: 'Please input your Password' },
                                    { min: 6, max: 18, message: "Password must be between 6 and 18 characters" },
                                    { validator: this.validateToNextPassword },
                                ]
                            })( <Input.Password /> )
                        }
                    </FormItem>
                    <FormItem label="Confirm Password" {...formItemLayout} hasFeedback>
                        {
                        getFieldDecorator('confirm', {
                            rules: [
                                { required: true, message: 'Please confirm your password'},
                                { validator: this.compareToFirstPassword },
                            ],
                        })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                    </FormItem>
                    <FormItem label="Email" {...formItemLayout}>
                        {
                            getFieldDecorator('email', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: 'Please input your Email' },
                                    { type: 'email', message: 'The input is not a valid email'},
                                ]
                            })( <Input allowClear/> )
                        }
                    </FormItem>
                    <FormItem label="Phone Number" {...formItemLayout}>
                        {
                            getFieldDecorator('phone', {
                                initialValue: '',
                                rules: [{ required: true }],
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



