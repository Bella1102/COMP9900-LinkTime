import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookies'
import axios from 'axios';
import moment from 'moment';
import { Form, Button, Row, Col, Collapse, DatePicker, 
    Select, Modal, Avatar, Tag, Tooltip, message, Affix, Empty } from 'antd';
import { actionCreators } from '../../redux/oneStore';
import  { axiosPostConfig } from '../../redux/oneStore/actionCreators';
import * as helpers from '../../utils/helpers';
import Newmodal from './modal';
import Success from '../../pages/success';
import './oneProp.less';

const { Option } = Select;
const { Panel } = Collapse;
const { confirm } = Modal;
const { RangePicker } = DatePicker;
const baseURL = helpers.BACKEND_URL;


class OneProp extends Component {
    
    state = {
        orderFlag: 0,
        visible: false
    }

    showModal(){
        this.setState({visible: true});
    };

    orderSuccess = () => {
        message.success('Order Success');
    };
    
    orderFailure = (err) => {
        message.error('Order Failure: ' + err);
    };

    goToLogin = () => {
        message.success('Go To Login Please');
    };

    handleSubmit = (token, prop_id) => {
        if (!token) {
            this.goToLogin()
        } else {
            this.props.form.validateFields((err, values) => {
                let confirmThis = this
                if (!err) {
                    let guests = values.guests.split(' ')[0];
                    let checkIn = values.checkInOut[0].format('YYYY-MM-DD');
                    let checkOut = values.checkInOut[1].format('YYYY-MM-DD');
                    confirm({
                        title: 'Do you want to confirm this order?',
                        onOk() {
                            return new Promise((resolve, reject) => {
                                setTimeout(function(){
                                    resolve();
                                }, 1000)
                            }).then(() => { 
                                confirmThis.comfirmOrder(token, prop_id, checkIn, checkOut, guests);
                            }).catch((reject) => console.log(reject));
                        },
                        onCancel() { },
                    });  
                }
            })
        }
    }

    comfirmOrder = (token, property_id, checkIn, checkOut, guests) => {
        const URL = baseURL + '/order/';
        const orderInfo = { "property_id": property_id, "checkIn": checkIn, "checkOut": checkOut, "guests": guests }
        axios.post(URL, orderInfo, axiosPostConfig(token)).then((res) => {
            this.orderSuccess();
            this.setState({orderFlag: 1})
        }).catch((error) => {
            this.orderFailure(error.response.data.message);
        })
    };
    
    render() {

        const { token, propDetail } = this.props;
        const { getFieldDecorator } = this.props.form;
        const prop_id = this.props.match.params.id;
        const guestNum = ['1  Guest', '2  Guests', '3  Guests', '4  Guests', '5  Guests', '6  Guests', '7  Guests', '8  Guests'];
        const tagColors = ["red", "gold", "blue", "lime", "cyan", "purple", "orange", "volcano", "magenta", "geekblue"]
        let available_dates; 
        if (propDetail){
            available_dates = propDetail.get('available_dates')
        }
        const disabledDate = (current) => {
            let cur = current.format('YYYY-MM-DD')
            let dates_set = new Set(available_dates.split(','))
            return dates_set.has(cur) === false
        }

        if (this.state.orderFlag){
            return (<Success />)
        }

        if (propDetail) {
            let amenities = propDetail.get('amenities').slice(1, -1).split(',')
            return (
                <div className="content">
                    <Row className="oneProp">
                        <Col span={12}>
                            <div style={{overflow: "hidden"}}>
                                <img className="pic" 
                                    src={ propDetail.get('img_url').get(0) } 
                                    onError={(e) => e.target.src=`${propDetail.get('img_url').get(0)}`}
                                    alt=""/>
                            </div>
                        </Col>
                        <Col span={12}>
                        {
                            [1,2,3,4].map((value, index) => {
                                if (index !== 4) {
                                    return(
                                        <div className='right' key={index}>
                                            <img className="pic" 
                                                src={ propDetail.get('img_url').get(value) } 
                                                onError={(e) => e.target.src=`${propDetail.get('img_url').get(value)}`}
                                                alt=""/>
                                            <Newmodal img_url={propDetail.get('img_url')} img_alt={propDetail.get('img_alt')} visible={this.state.visible}/>
                                        </div>
                                    )
                                } else {
                                    return(
                                        <div className='right' key={index}>
                                            <img className="pic" 
                                                src={ propDetail.get('img_url').get(value) } 
                                                onError={(e) => e.target.src=`${propDetail.get('img_url').get(value)}`}
                                                alt=""/>
                                        </div>
                                    )
                                } 
                            })
                        }
                        </Col>
                    </Row>                    
                    <Row className="showDetail">
                        <div className="upper">
                            <div className="profile">
                                <Avatar size={80} src={propDetail.get('host_img_url')} className="avatar" alt=""/>
                                <div className="name">{propDetail.get('host_name')}</div>
                            </div>
                            <div className="description">
                                <div className="title">{ propDetail.get("title") }</div>
                                <p className="location">{ propDetail.get("location") }</p>
                                <p>
                                    <span style={{marginRight: "1%"}}>
                                        {propDetail.get("bedrooms")} {propDetail.get("bedrooms") > 1 ? "bedrooms" : "bedroom"}
                                    </span>
                                    <span style={{marginRight: "1%"}}>
                                        { propDetail.get("bathrooms")} {propDetail.get("bathrooms") > 1 ? "bathrooms" : "bathroom"}
                                    </span>
                                    <span style={{marginRight: "1%"}}>
                                        { propDetail.get("accommodates")} {propDetail.get("accommodates") > 1 ? "guests" : "guest"}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <Col span={15}>
                            <div className="bigFonts">
                                More about the property
                            </div>
                            <Collapse defaultActiveKey={['1', '2', '3']}
                                      style={{marginBottom: 20}}>
                                {
                                    propDetail.get("description") ?
                                    <Panel header="Description" key="1">
                                        <p>{propDetail.get("description")}</p>
                                    </Panel> : null
                                }
                                {
                                    propDetail.get("house_rules") ?
                                    <Panel header="House rules( IMPORTANT! )" key="2">
                                        <p>{propDetail.get("house_rules")}</p>
                                    </Panel> : null
                                }
                                <Panel header="Amenities" key="3">
                                    {
                                        amenities.map((element, index) => {
                                            let indexList = index.toString().split('')
                                            let newIndex = parseInt(indexList[indexList.length - 1])
                                            return(
                                                <Tag key={index} color={tagColors[newIndex]} style={{ marginBottom: 10 }}>
                                                    {element}
                                                </Tag>)
                                        })
                                    }
                                </Panel>
                            </Collapse>
                            
                            <div className="reviews">
                                <div className="bigFonts">Reviews</div>
                                {
                                    propDetail.get("reviews").size <= 1 ?
                                    <div className="review_num">{`${propDetail.get("reviews").size} review in total`}</div> :
                                    <div className="review_num">{`${propDetail.get("reviews").size} reviews in total`}</div>
                                }
                            </div>
                            {
                                propDetail.get("reviews").size === 0 ? <Empty description={<span>No review!</span>} style={{marginTop: "50px"}}/> : 
                                propDetail.get("reviews").map((item, index) => {
                                    return (
                                        <div key={index} style={{marginBottom: 30}}>
                                            <div style={{width: "100%", height: 60 }}>
                                                <Avatar size={48} className="review_photo" src={item.get('head_picture')} alt=""></Avatar>
                                                <div className="review_info">
                                                    <div style={{paddingTop: 2, color: "#ad6800", fontSize: 16, fontWeight: 600}}>{item.get("reviewer_name")}</div>
                                                    <div style={{paddingTop: 2, color: "#bfbfbf", fontSize: 12}}>
                                                        <Tooltip title={item.get("review_date")}>
                                                            {moment(item.get("review_date")).fromNow()}
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                            <div>{item.get("review_content")}</div>
                                        </div>
                                    )
                                })
                            }
                          
                        </Col>
                        <Col span={9}>
                            <Affix offsetTop={20}>
                            <div className="checkInOut">
                                <p className="checkLine">
                                    <span className="checkPrice">{propDetail.get("price")}</span>
                                    <span>per night</span>
                                </p>
                                <Form>
                                    <Form.Item label="Dates" >
                                        {
                                            getFieldDecorator('checkInOut', {
                                                initialValue: '',
                                                rules: [{ required: true } ]
                                            })( <RangePicker 
                                                    style={{width: "100%"}}
                                                    disabledDate={disabledDate}
                                                    size="large"
                                                    placeholder={["Check-In", "Check-Out"]}
                                                    ranges={{ Today: [moment(), moment()], 
                                                        'This Month': [moment(), moment().endOf('month')]}} />)
                                        }
                                    </Form.Item>
                                    <Form.Item label="Guests" >
                                        {
                                            getFieldDecorator('guests', {
                                                initialValue: '1 Guest',
                                                rules: [{ required: true }],
                                            })( <Select size="large" >
                                                    {
                                                        guestNum.map(item => (
                                                            <Option key={item} value={item} disabled={parseInt(propDetail.get("accommodates")) < parseInt(item.split(' ')[0])}>
                                                                {item}
                                                            </Option>
                                                        ))
                                                    }
                                                </Select>)
                                        }
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                                onClick={() => this.handleSubmit(token, prop_id)}
                                                style={{color: "black", width: "100%", height: 42, marginTop: 20, fontSize: 20, fontWeight: "bold", backgroundColor: "#ffc53d"}}>
                                            Reserve
                                        </Button>
                                    </Form.Item>
                                </Form>
                                <div className="checkNotes">Enter dates and number of guests to check the total trip price, no extra charge and any taxes.</div>
                            </div>
                            </Affix>
                        </Col>
                    </Row>
                </div>
            );
        }
        return null;
    }

    UNSAFE_componentWillMount(){
        const prop_id = this.props.match.params.id
        this.props.getPropDetail(prop_id)
        if (cookie.load('userInfo')){
            this.props.isLogin(cookie.load('userInfo'))
        }
    }
}

const mapState = (state) => {
	return {
        loginStatus: state.getIn(["combo", "loginStatus"]),
        userInfo: state.getIn(["combo", "userInfo"]),
        token: state.getIn(["combo", "token"]),
        propDetail: state.getIn(["combo", "propDetail"]),
	}
}

const mapDispatch = (dispatch) => ({
    isLogin(token){
        dispatch(actionCreators.isLogin(token))
    },
    getPropDetail(property_id) {
        dispatch(actionCreators.getPropDetail(property_id))
    }
});


export default connect(mapState, mapDispatch)(Form.create()(OneProp));



