import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Modal } from 'antd';
import { actionCreators } from '../../redux/oneStore';
import './order.less';



const { confirm } = Modal;



class Order extends Component {

    state = { 
        visible: false 
    }    
    confirmCancelOrder = (token, order_id) => {
        let del = this
        confirm({
            title: 'Do you want to cancel this order?',
            cancelText: 'No',
            onOk() {
                return new Promise((resolve, reject) => {
                    // setTimeout(Math.random() > 0.5 ? resolve : reject, 2000);
                    setTimeout(function(){
                        resolve();
                    }, 1500)
                }).then(() => { 
                    del.props.deleteOrder(token, order_id)
                }).catch((reject) => console.log(reject));
            },
            onCancel() { },
        });
    }     

  
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
                            const price = item.get('price').split('.')[0]
                            return (
                                <Col span={12} key={index} className="allOrders">
                                    <Link to={`/props/${ item.get('property_id')}`}>
                                        <img src={item.get('img_url')} alt="" className="image"/>
                                    </Link>
                                    <div className="detail">
                                        <div className="title">{item.get('title')}</div>
                                        <div className="location" style={{ marginTop: 5 }}>{item.get('location')}</div>
                                        <div className="price">{price} AUD/night</div>
                                        <div className="rentTime">Rent period: {`${item.get('checkIn')} `} to {`${item.get('checkOut')}`}</div>
                                        <div className="orderTime">Order time: {`${item.get('order_time')}`}</div>
                                        {
                                            item.get('order_status') === 'Active' ?
                                            <Fragment>
                                                <Button type="primary" style={{width: 110}}
                                                        onClick={() => this.confirmCancelOrder(token, item.get('order_id'))}
                                                        // onClick={() => {this.props.deleteOrder(token, item.get('order_id'))}}
                                                >
                                                    Cancel Order
                                                </Button>
                                                <Button type="primary" 
                                                        style={{marginLeft: 20, width: 110}}
                                                        onClick={ () => this.setState({ visible: true }) }>
                                                    Comment
                                                </Button>
                                            </Fragment> :
                                            <Fragment>
                                                <Button disabled>Cancel Order</Button>
                                                <Button disabled style={{marginLeft: 20, width: 110}}>Comment</Button>
                                            </Fragment>
                                        }
                                    </div>
                                </Col>
                            )
                        }) : null
                    }
                </Row>
                <Modal
                    title="Order Comment"
                    visible={this.state.visible}
                    onOk={ () => this.setState({ visible: false }) }
                    onCancel={ () => this.setState({ visible: false }) }
                    >
                    <p>Some contents...</p>
                </Modal>
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


