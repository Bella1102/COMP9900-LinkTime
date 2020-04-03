import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import { actionCreators } from '../../redux/oneStore';



class MyProp extends Component {

    state = {
        
    };

    render() {
        const { token, allProps } = this.props;

        return (
            <div className="content">
            <div className="orderTitle">
                My Properties
            </div>
            <Row>
                {   
                    allProps !== null ?
                    allProps.map((item, index) => {
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
                                                onClick={() => {this.props.deleteProperty(token, item.get('property_id'))}}>
                                            Cancel
                                        </Button> :
                                        <Button disabled>Cancel</Button>
                                    }
                                     <Button type="primary" >Edit</Button>
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
        this.props.getMyProps(this.props.token)
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
    getMyProps(token) {
        dispatch(actionCreators.getMyProps(token))
    },
    deleteProperty(token, property_id) {
        dispatch(actionCreators.deleteProperty(token, property_id))
    },
    updateProperty(token, property_id) {
        dispatch(actionCreators.updateProperty(token, property_id))
    }  
    
});


export default connect(mapState, mapDispatch)(MyProp);

