import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Avatar, Row, Col, Button, Dropdown, Menu} from 'antd';
import { actionCreators as loginActionCreators } from '../../pages/Form/store';
import './index.less';




class Header extends Component {

    constructor(props) {
		super(props);
		this.state = {
            
		};
    }

    headerMenu() {
        return (
            <Menu>
                <Menu.Item style={{width: 180, height: 35, fontWeight: 600, marginTop: 10}}>
                    <Link to='/order'>My orders</Link>
                </Menu.Item>
                <Menu.Item style={{width: 180, height: 35, fontWeight: 600 }}>
                    <Link to='/host'>Become a host</Link>
                </Menu.Item>
                <Menu.Item style={{width: 180, height: 35, fontWeight: 600 }}>
                    <Link to='/property'>My properties</Link>
                </Menu.Item>
                <Menu.Item style={{width: 180, height: 35, fontWeight: 600 }}>
                    <Link to='/request'>Post request</Link>
                </Menu.Item>
                <Menu.Item style={{width: 180, height: 35, color: '#f9c700', fontWeight: 600,}}>
                    <Link style={{ color: '#f9c700'}}to='/' onClick={this.props.logout} >Log Out</Link>
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
                        <Link to='/register'><Button type="primary" className="logreg">Sign up</Button></Link>
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

                        <Dropdown overlay={this.headerMenu()} placement="bottomCenter">
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

