import React, { Component } from "react";
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { actionCreators } from '../../redux/oneStore';
import { Form, Input, Button, Icon, Checkbox } from "antd";



class Login extends Component{

    state = {
    }

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.props.login(values.username, values.password)
            }
        })
    }

    render(){
        
        const { loginStatus } = this.props;
        const { getFieldDecorator } = this.props.form;

		if (!loginStatus) {
            return (
                <div>
                    <Form style={{width: 360, marginLeft: 520, marginTop: 200, minHeight: 600}}>
                        <Form.Item>
                            {
                                getFieldDecorator('username',{ 
                                    initialValue:'', 
                                    rules:[
                                            { required: true, message: 'Please input your username' },
                                            { max: 18, message: "Username cannot be longer than 18 characters" },
                                            { pattern: new RegExp('^\\w+$', 'g'), message: 'Username can only contain digitals or letters' }
                                        ]
                                })( <Input prefix={<Icon type="user"/>} placeholder="Username" allowClear/> )
                            }
                        </Form.Item>
                        <Form.Item hasFeedback >
                            {
                                getFieldDecorator('password', {
                                    initialValue: '',
                                    rules: [
                                        { required: true, message: 'Please input your Password' },
                                        { min: 6, max: 18, message: "Password must be between 6 and 18 characters" }
                                    ]
                                })( <Input.Password prefix={<Icon type="lock"/>} placeholder="Password"/> )
                            }
                        </Form.Item>
                        <Form.Item>
                            {
                                getFieldDecorator('remember', {
                                    valuePropName: 'checked',
                                    initialValue: true
                                })( <Checkbox>Remember me</Checkbox> )
                            }
                            <Link to="/forgotPassword" style={{float: 'right'}}>Forgot password</Link>
                            <Button type="primary" onClick={ this.handleSubmit } style={{width: '100%'}}>Log in</Button>
                            Or <Link to="/signup">register now!</Link>
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
		loginStatus: state.getIn(["combo", "loginStatus"])
	}
}

// 把store的dispatch方法挂载到props上
const mapDispatch = (dispatch) => ({
    login(username, password) {
		dispatch(actionCreators.login(username, password))
	}
});


export default connect(mapState, mapDispatch)(Form.create()(Login));
