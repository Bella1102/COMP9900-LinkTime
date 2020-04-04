import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Button, Modal, Tabs, Input, } from 'antd';
import { actionCreators } from '../../redux/oneStore';
import './order.less';



const { confirm } = Modal;
const { TabPane } = Tabs;



class Order extends Component {

    state = { 
        visible: false,
        prop_id: null,
        order_id: null
    }    

    confirmCancelOrder = (token, order_id) => {
        let cancelThis = this
        confirm({
            title: 'Do you want to cancel this order?',
            cancelText: 'No',
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(function(){
                        resolve();
                    }, 1500)
                }).then(() => { 
                    cancelThis.props.deleteOrder(token, order_id)
                }).catch((reject) => console.log(reject));
            },
            onCancel() { },
        });
    }

    submitReview(token, property_id, order_id) {
        let commentThis = this
        let comment = this.props.form.getFieldsValue()
        return new Promise((resolve, reject) => {
            setTimeout(function(){
                resolve();
            }, 1000)
        }).then(() => { 
            commentThis.props.submitComment(token, property_id, order_id, comment.title, comment.content)
        }).catch((reject) => console.log(reject));
    }

    
    showOrders(token, allOrders, tab){
        return (
            <Row>
                {   
                    allOrders !== null ?
                    allOrders.map((item, index) => {
                        const price = item.get('price').split('.')[0]
                        if (tab === "all") {
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
                                                >
                                                    Cancel Order
                                                </Button>
                                                <Button type="primary" 
                                                        style={{marginLeft: 20, width: 110}}
                                                        onClick={ () => this.setState({ visible: true, prop_id: item.get('property_id'), order_id: item.get('order_id') }) }>
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
                        } else if (tab === "Active" & item.get('order_status') === 'Active' ) {
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
                                        <Button type="primary" style={{width: 110}}
                                                onClick={() => this.confirmCancelOrder(token, item.get('order_id'))}
                                        >
                                            Cancel Order
                                        </Button>
                                        <Button type="primary" 
                                                style={{marginLeft: 20, width: 110}}
                                                onClick={ () => this.setState({ visible: true, prop_id: item.get('property_id'), order_id: item.get('order_id') }) }>
                                            Comment
                                        </Button>
                                    </div>
                                </Col>
                            )
                        } else if (tab === "Canceled" & item.get('order_status') === 'Canceled' ){
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
                                        <Button disabled>Cancel Order</Button>
                                        <Button disabled style={{marginLeft: 20, width: 110}}>Comment</Button>
                                    </div>
                                </Col>
                            )
                        }
                    }) : null
                }
            </Row>
        )
    }

  
    render() {
        const { token, allOrders } = this.props;  
        const { getFieldDecorator } = this.props.form;

        return (
            <div className="content">
                <div className="orderTitle">
                    My Orders
                </div>
                <Tabs defaultActiveKey="1" className="tabStyle">
                    <TabPane tab="Active Orders" key="1">
                        { this.showOrders(token, allOrders, "Active") }
                    </TabPane>
                    <TabPane tab="Cancelled Orders" key="2">
                        { this.showOrders(token, allOrders, "Canceled") }
                    </TabPane>
                    <TabPane tab="All Orders" key="3">
                        { this.showOrders(token, allOrders, "all") }
                    </TabPane>
                </Tabs>
                <Modal
                    title="Order Comment"
                    okText="Submit"
                    visible={this.state.visible}
                    onOk={ () => { this.setState({ visible: false }); this.submitReview(token, this.state.prop_id, this.state.order_id) }}
                    onCancel={ () => this.setState({ visible: false }) }
                    >
                    <Form style={{ }}>
                        <Form.Item label="Title">
                            {
                                getFieldDecorator('title',{ 
                                    initialValue:'', 
                                    rules:[{ required: true }]
                                })( <Input placeholder="Title"/> )
                            }
                        </Form.Item>
                        <Form.Item label="Description" >
                            {
                                getFieldDecorator('content', {
                                    initialValue: '',
                                    rules: [{ required: true }]
                                })( <Input.TextArea placeholder="Please input request detail" allowClear/> )
                            }
                        </Form.Item>
                    </Form>
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
    },
    submitComment(token, property_id, order_id, title, content) {
        dispatch(actionCreators.submitComment(token, property_id, order_id, title, content))
    } 
});


export default connect(mapState, mapDispatch)(Form.create()(Order));


