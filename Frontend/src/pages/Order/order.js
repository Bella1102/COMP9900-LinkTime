import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import { actionCreators } from '../../redux/oneStore';
import './order.less';



class Order extends Component {

    state = {
        
    };

    render() {
        const { token, allOrders } = this.props;

        return (
            <div className="content">
                <div className="orderTitle">
                    My Orders
                </div>
                <Row>
                    {   
                        allOrders !== null ?
                        allOrders.map((item, index) => {
                            return (
                                <Col span={12} key={index} className="allOrders">
                                    <Link to={`/prop/${ item.get('property_id')}`}>
                                        <img src={item.get('checkIn')} alt=""/>
                                    </Link>
                                    <div className="detail">
                                        <div className="title">{item.get('checkIn')}</div>
                                        <div style={{ marginTop: 5 }}>{item.get('checkIn')}</div>
                                        <p>
                                            <span>{`${item.get('checkIn')} `}</span>
                                            <span>{`${item.get('checkOut')}`}</span>
                                        </p>
                                        <div>{`${item.get('order_time')}:`}</div>
                                        {
                                            item.get('order_status') === 'Active' ?
                                            <Button type="primary" 
                                                    onClick={() => {this.props.deleteOrder(token, item.get('order_id'))}}>
                                                Cancel Order
                                            </Button> :
                                            <Button disabled>Cancel Order</Button>
                                        }
                                    </div>
                                </Col>
                            )
                        }) : null
                    }
                </Row>  
            </div>
          );
    }

    UNSAFE_componentWillMount(){
        if (localStorage.linkToken){
            this.props.isLogin(localStorage.linkToken)
        }
        this.props.getMyOrders(this.props.token)
    }
}

const mapState = (state) => {
	return {
        loginStatus: state.getIn(["combo", "loginStatus"]),
        token: state.getIn(["combo", "token"]),
        allOrders: state.getIn(["combo", "allOrders"]),
	}
}

const mapDispatch = (dispatch) => ({
    isLogin(token){
        dispatch(actionCreators.isLogin(token))
    },
    getMyOrders(token) {
        dispatch(actionCreators.getMyOrders(token))
    },
    deleteOrder(token, order_id) {
        dispatch(actionCreators.deleteOrder(token, order_id))
    }  
});


export default connect(mapState, mapDispatch)(Order);


