import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'antd';
// import { CSSTransition } from 'react-transition-group';
// import { actionCreators } from './store';
// import { SearchWrapper, NavSearch} from './style';
import './index.less';




class Header extends Component {

    constructor(props) {
		super(props);
		this.state = { 
            focused: false,
            mouseIn: false,
            list: [],
            page: 1,
            totalPage: 1
		};
    }


    render() {
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
}


const mapState = (state) => {
	return {
		login: state.getIn(['login', 'login'])
		
	}
};

const mapDispath = (dispatch) => {
	return {
		// logout() {
		// 	dispatch(loginActionCreators.logout())
		// }
	}
};


export default connect(mapState, mapDispath)(Header);