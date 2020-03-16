import React, { Component } from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { actionCreators } from './store';
import { Form, Input, Button, Icon, Checkbox } from "antd";



class Login extends Component{

    handleSubmit = () => {
        // let userInfo = this.props.form.getFieldsValue();
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.props.login(values.username, values.password)
            }
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const { loginStatus } = this.props;

		if (!loginStatus) {
            return (
                <div>
                    <Form style={{width: 360, marginLeft: 520, marginTop: 200, minHeight: 600}}>
                        <Form.Item>
                            {
                                getFieldDecorator('username',{ 
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
                                })( <Input.Password prefix={<Icon type="lock"/>} type="password" placeholder="Password" /> )
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
        } else {
			return (
				<Redirect to='/'/>
			)
		}
    }
}

const mapState = (state) => {
	return {
		loginStatus: state.getIn(["login", "loginStatus"])
	}
}

const mapDispatch = (dispatch) => ({
    login(username, password) {
		dispatch(actionCreators.login(username, password))
	}
});


export default connect(mapState, mapDispatch)(Form.create()(Login));
