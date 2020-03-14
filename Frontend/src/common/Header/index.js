import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'antd';
// import { CSSTransition } from 'react-transition-group';
// import { actionCreators } from './store';
import './index.less';
// import { SearchWrapper, NavSearch} from './style';




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
    
    // handleInputFocus(list) {
    //     if (this.state.list.size === 0) {
    //         dispatch(actionCreators.getList())
    //     }
    //     dispatch(actionCreators.searchFocus())
    // }

    // handleInputBlur() {
    //     dispatch(actionCreators.searchBlur())
    // }

    // handleMouseEnter() {
    //     dispatch(actionCreators.mouseEnter());
    // }

    // handleMouseLeave() {
    //     dispatch(actionCreators.mouseLeave());
    // }

    handleChangePage(page, totalPage, spin) {
        let originAngle = spin.style.transform.replace(/[^0-9]/ig, '');
        if (originAngle) {
            originAngle = parseInt(originAngle, 10);
        }else {
            originAngle = 0;
        }
        spin.style.transform = 'rotate(' + (originAngle + 360) + 'deg)';

        // if (page < totalPage) {
        //     dispatch(actionCreators.changePage(page + 1));
        // }else {
        //     dispatch(actionCreators.changePage(1));
        // }
    }

    render() {
        return (
            <div className="header">
                <Row className="header-top">
                    <Col span={24}>
                        <Link to='/' className="logo">LinkTime</Link>
                        {/* <SearchWrapper >
                            <CSSTransition
                                in={this.state.focused}
                                timeout={200}
                                classNames="slide">
                                <NavSearch placeholder="Search"
                                    className={this.state.focused ? 'focused' : ''}
                                    onFocus={ }
                                    onBlur={ }
                                ></NavSearch>
                            </CSSTransition>
						    { this.getListArea() }
					    </SearchWrapper> */}
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