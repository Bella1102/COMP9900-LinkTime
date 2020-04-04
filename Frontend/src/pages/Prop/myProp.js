import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import { actionCreators } from '../../redux/oneStore';
import './index.less';



class MyProp extends Component {


    render() {
        const { token, allProps } = this.props;

        return (
            <div className="content">
                <div className="propTitle">
                    My Properties
                </div>
                <Row>
                    {   
                        allProps !== null ?
                        allProps.map((item, index) => {
                            const price = item.get('price').split('.')[0]
                            return (
                                <Col span={12} key={index} className="allProps">
                                    <Link to={`/props/${ item.get('property_id')}`}>
                                        <img src={`file://${item.get('img_url')}`} alt="" className="image"/>
                                    </Link>
                                    <div className="detail">
                                        <div className="title">{item.get('title')}</div>
                                        <div className="location" style={{ marginTop: 5 }}>{item.get('location')}</div>
                                        <div className="price">{price} AUD/night</div>
                                        {
                                            item.get('order_status') === 'Active' ?
                                            <Button type="primary" 
                                                    onClick={() => {this.props.deleteProperty(token, item.get('property_id'))}}>
                                                Cancel Order
                                            </Button> :
                                            <Button disabled>Cancel Order</Button>
                                        }
                                    </div>
                                </Col>
                            )
                        }) : null
                    }
                    <Col span={12}>
                        <Link to="/postProp">
                            <Button icon="plus" className="addProp">Add a new property</Button>
                        </Link>
                    </Col>
                </Row>  
            </div>
        );
    }

    UNSAFE_componentWillMount(){
        if (localStorage.linkToken){
            this.props.isLogin(localStorage.linkToken)
        }
        this.props.getUserInfo(this.props.token)
    }
}


const mapState = (state) => {
	return {
        loginStatus: state.getIn(["combo", "loginStatus"]),
        token: state.getIn(["combo", "token"]),
        allProps: state.getIn(["combo", "allProps"]),
	}
}

const mapDispatch = (dispatch) => ({
    isLogin(token){
        dispatch(actionCreators.isLogin(token))
    },
    getUserInfo(token) {
        dispatch(actionCreators.getUserInfo(token))
    },
    deleteProperty(token, property_id) {
        dispatch(actionCreators.deleteProperty(token, property_id))
    },
    updateProperty(token, property_id) {
        dispatch(actionCreators.updateProperty(token, property_id))
    }  
    
});


export default connect(mapState, mapDispatch)(MyProp);

