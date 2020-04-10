import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookies'
import { Row, Col, Icon, Avatar } from 'antd';
import { actionCreators } from '../../redux/oneStore';
import FourOThree from '../../pages/403';
import './profile.less';


class Profile extends Component {


    render() {
        const { loginStatus, userInfo } = this.props;

        if (!loginStatus){
            return (<FourOThree subTitle={"Sorry, you are not authorized to access user orders page before logining."}/>)
        }

        if (userInfo) {
            return (
                <div className="content">
                    <div className="showProfile">
                        <Row>
                            <Col span={10} className="profileLeft">
                                <div className="imageWrap">
                                    <Avatar size={150} src={userInfo.get("avatar")} alt="" className="image"></Avatar>
                                    <div className="editProfile">Edit Profile</div>
                                </div>
                                <div className="profileDetail">
                                    <div className="emailLine">
                                        <Icon type="check-circle" style={{marginRight: 10, color: "#006d75"}}/>
                                        <span>Email address</span>
                                    </div>
                                    <div className="emailLine">
                                        <Icon type="check-circle" style={{marginRight: 10, color: "#006d75"}}/>
                                        <span>Phone number</span>
                                    </div>
                                </div>
                            </Col>
                            <Col span={12} className="profileRight">
                                <div className="helloWrap">
                                    <div className="hello">Hi, I'm {userInfo.get("username")}</div>
                                    <div className="joinWrap">
                                        <span className="join">Joined in 2020</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            );
        }
        return null
    }

    UNSAFE_componentWillMount(){
        if (cookie.load('userInfo')){
            this.props.isLogin(cookie.load('userInfo'))
        }
        this.props.getUserInfo(this.props.token)
    }
}


const mapState = (state) => {
	return {
        loginStatus: state.getIn(["combo", "loginStatus"]),
        userInfo: state.getIn(["combo", "userInfo"]),
        token: state.getIn(["combo", "token"])
	}
}

const mapDispatch = (dispatch) => ({
    isLogin(token){
        dispatch(actionCreators.isLogin(token))
    },
    getUserInfo(token) {
        dispatch(actionCreators.getUserInfo(token))
    } 
    
});


export default connect(mapState, mapDispatch)(Profile);

