import React, { Component } from 'react';
import moment from 'moment';
import {Form, Button, Input, DatePicker, message} from 'antd';


const FormItem = Form.Item;
const TextArea = Input.TextArea;



class Register extends Component{

    state = {
        imgList: []
    }

    handleSubmit = () => {
        let userInfo = this.props.form.getFieldsValue();
        message.success(`${userInfo.userName} Current Password is：${userInfo.userPwd}`)
    }

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
                            })( <Input type="password" placeholder="Please input your password" /> )
                        }
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
                    <FormItem label="Birthday" {...formItemLayout}>
                        {
                            getFieldDecorator('birthday', {
                                initialValue: moment("1994-11-02")
                            })( <DatePicker showTime format="YYYY-MM-DD" /> )
                        }
                    </FormItem>
                    <FormItem label="Address" {...formItemLayout}>
                        {
                            getFieldDecorator('address',{
                                initialValue: ''
                            })( <TextArea autoSize={{ minRows: 1, maxRows: 3 }} placeholder="Please input your address"/> )
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
