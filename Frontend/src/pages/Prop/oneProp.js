import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, } from 'antd';
import { actionCreators } from '../../redux/oneStore';
import './oneProp.less';



class OneProp extends Component {


    render() {
        const { propDetail } = this.props;
        return (
            <div className="content">
                <Row className="oneProp">
                    <Col span={12}>
                        <div style={{overflow: "hidden"}}>
                            <img className="pic" src={ propDetail ? propDetail.get('img_url').get(0) : null } alt=""/>
                        </div>
                    </Col>
                    <Col span={12}>
                        {
                           [1,2,3,4].map((value, index) => {
                               return(
                                    <div className='right' key={index}>
                                        <img className="pic" src={ propDetail ? propDetail.get('img_url').get(value) : null } alt=""/>
                                    </div>
                               )   
                           })
                        }
                    </Col>
                </Row>
                <Row className="showDetail">
                    <Col span={14}>
                        left
                    </Col>
                    <Col span={10}>
                        right
                    </Col>
                </Row>
            </div>
          );
    }

    UNSAFE_componentWillMount(){
        const prop_id = this.props.match.params.id;
        this.props.getPropDetail(prop_id);   
    }
}

const mapState = (state) => {
	return {
        loginStatus: state.getIn(["combo", "loginStatus"]),
        propDetail: state.getIn(["combo", "propDetail"]),
	}
}

const mapDispatch = (dispatch) => ({
    getPropDetail(property_id) {
        dispatch(actionCreators.getPropDetail(property_id))
    }
});


export default connect(mapState, mapDispatch)(OneProp);



