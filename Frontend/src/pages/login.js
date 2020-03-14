import React, { Component } from "react";
import { Form, Input, Button, message, Icon, Checkbox } from "antd";



class Login extends Component{

    handleSubmit = ()=>{
        let userInfo = this.props.form.getFieldsValue();
        this.props.form.validateFields((err, values) => {
            if(!err){
                message.success(`${userInfo.userName} Current Passowrd is：${userInfo.password}`)
            }
        })
    }

    render(){
        
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Form style={{width: 360, marginLeft: 520, marginTop: 200}}>
                    <Form.Item>
                        {
                            getFieldDecorator('userName',{ 
                                initialValue:'', 
                                rules:[
                                        { required: true, message: 'Please input your username!' },
                                        { max: 18, message: 'Username length is not valid!' },
                                        { pattern: new RegExp('^\\w+$', 'g'), message: 'Username can only contain digitals or letters!' }
                                    ]
                            })( <Input prefix={<Icon type="user"/>} placeholder="Username" /> )
                        }
                    </Form.Item>
                    <Form.Item>
                        {
                            getFieldDecorator('password', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: 'Please input your Password!' },
                                    { min: 6, max: 18, message: 'Password length is not valid!' }
                                ]
                            })( <Input prefix={<Icon type="lock"/>} type="password" placeholder="Password" /> )
                        }
                    </Form.Item>
                    <Form.Item>
                        {
                            getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true
                            })( <Checkbox>Remember me</Checkbox> )
                        }
                        <a href="/forgotPassword" style={{float: 'right'}}>Forgot password</a>
                        <Button type="primary" onClick={ this.handleSubmit } style={{width: '100%'}}>Log in</Button>
                        Or <a href="/register">register now!</a>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}


export default Form.create()(Login);
