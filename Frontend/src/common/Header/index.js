import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Avatar, Row, Col, Button, Dropdown, Menu, Icon} from 'antd';
import { actionCreators as loginActionCreators } from '../../pages/Form/store';
import './index.less';




class Header extends Component {

    constructor(props) {
		super(props);
		this.state = {
            
		};
    }

    visitorMenu() {
        return (
            <Menu>
                <Menu.Item style={{width: 180, height: 35, fontWeight: 600, marginTop: 10}}>
                    <Link to='/login'><Icon type="login" style={{color: '#f9c700', marginRight: 10}}/>Login</Link>
                </Menu.Item>
                <Menu.Item style={{width: 180, height: 35, fontWeight: 600}}>
                    <Link to='/signup'><Icon type="user-add" style={{color: '#f9c700', marginRight: 10}}/>Sign Up</Link>
                </Menu.Item>
                <Menu.Item style={{width: 180, height: 35, fontWeight: 600 }}>
                    <Link to='/request' style={{color: '#f9c700'}}>
                        <Icon type="message" theme="filled" style={{marginRight: 10}}/>Post Request
                    </Link>
                </Menu.Item>
            </Menu>
        )
    }

    loginMenu() {
        return (
            <Menu>
                <Menu.Item style={{width: 180, height: 35, fontWeight: 600, marginTop: 10}}>
                    <Link to='/profile'>Profile</Link>
                </Menu.Item>
                <Menu.Item style={{width: 180, height: 35, fontWeight: 600}}>
                    <Link to='/order'>My orders</Link>
                </Menu.Item>
                <Menu.Item style={{width: 180, height: 35, fontWeight: 600 }}>
                    <Link to='/host'>Become a host</Link>
                </Menu.Item>
                <Menu.Item style={{width: 180, height: 35, fontWeight: 600 }}>
                    <Link to='/property'>My properties</Link>
                </Menu.Item>
                <Menu.Item style={{width: 180, height: 35, fontWeight: 600 }}>
                    <Link to='/request'>Post Request</Link>
                </Menu.Item>
                <Menu.Item style={{width: 180, height: 35, fontWeight: 600}}>
                    <Link to='/' style={{color: '#f9c700'}} onClick={this.props.logout} >
                        <Icon type="logout" style={{color: '#f9c700', marginRight: 10}}/>Log Out
                    </Link>
                </Menu.Item>
            </Menu>
        )
    }

    beforeLogin() {
        return (
            <div className="header">
                <Row className="header-top">
                    <Col span={24}>
                        <Link to='/' className="logo">LinkTime</Link>
                        <Link to='/login'><Button type="primary" className="logreg">Log in</Button></Link>
                        <Link to='/signup'><Button type="primary" className="logreg">Sign up</Button></Link>
                        <Dropdown overlay={this.visitorMenu()} placement="bottomCenter">
                            <Avatar size={48} 
                                    icon="user"
                                    className="logreg"
                                    style={{ backgroundColor: '#f9c700' }}>
                            </Avatar>
                        </Dropdown>
                    </Col>
                </Row>
            </div>
          );
    }

    afterLogin() {
        return (
            <div className="header">
                <Row className="header-top">
                    <Col span={24}>
                        <Link to='/' className="logo">LinkTime</Link>
                        <Link to='/order'>
                            <Button type="primary" className="orders">My orders</Button>
                        </Link>

                        <Dropdown overlay={this.loginMenu()} placement="bottomCenter">
                            <Avatar size={48} 
                                    icon="user"
                                    className="logreg"
                                    style={{ backgroundColor: '#f9c700' }}>
                            </Avatar>
                        </Dropdown>
                    </Col>
                </Row>
            </div>
          );
    }


render() {
        const { loginStatus } = this.props;
		if (!loginStatus) {
			return this.beforeLogin()
		} else {
			return this.afterLogin()
		}
    }
}


const mapState = (state) => {
	return {
        loginStatus: state.getIn(["login", "loginStatus"]),
        userInfo: state.getIn(["login", "userInfo"]),
		
	}
};

const mapDispath = (dispatch) => {
	return {
		logout() {
			dispatch(loginActionCreators.logout())
		}
	}
};

export default connect(mapState, mapDispath)(Header);

