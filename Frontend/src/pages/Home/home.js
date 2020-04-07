import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { Form, Row, Col, Button, Select, Carousel, DatePicker, Cascader } from 'antd';
import { actionCreators } from '../../redux/oneStore';
import * as helpers from '../../utils/helpers';
import './home.less';


const { Option } = Select;
const { RangePicker } = DatePicker;


class Home extends Component {


    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if(!err){
                let location, house_type, start_date, end_date;
                [location, house_type, start_date, end_date] = helpers.searchSubmit(values)
                this.props.search(location, house_type, start_date, end_date)

            }
        })
    }
    
    render() {
        const { homePropInfo } = this.props;
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const typeOptions = ['House', 'Apartment', 'Studio', 'Unit']
        const typeImages = ["/space-type/house.png", "/space-type/apartment.png", 
                            "/space-type/studio.png", "/space-type/unit.png"]
        let locationOptions = []
        if (homePropInfo !== null){
            locationOptions =  helpers.getLocationOptions(homePropInfo)
        }

        let location, house_type, start_date, end_date;
        [location, house_type, start_date, end_date] = helpers.searchSubmit(getFieldsValue())

        const searchURL = "?location=" + location + "&type=" + house_type + 
                          "&start_date=" + start_date + "&end_date=" + end_date

        return (
            <div className="homeContent" >
                <div className="contentUp">
                    {
                        this.props.loginStatus ?
                        <h1 className="book">Hi {this.props.userInfo.get("username")}, Welcome to book your trip!</h1> :
                        <h1 className="book">Welcome to book your trip!</h1>
                    }
                     <Form layout="inline" style={{marginBottom: "1%"}}>
                        <Form.Item>
                            {
                                getFieldDecorator('location', {
                                    initialValue: '',
                                    rules: []
                                })(<Cascader style={{marginRight: "2%"}} options={locationOptions} placeholder="Select location" />)
                            }
                        </Form.Item>
                        <Form.Item>
                            {
                                 getFieldDecorator('type', {
                                    initialValue: undefined,
                                    rules: []
                                })(<Select allowClear style={{width: 205}} placeholder="Select type">
                                    {
                                        typeOptions.map(item => (
                                            <Option key={item} value={item}>{item}</Option>
                                        ))
                                    }
                                </Select>)
                            }
                        </Form.Item>
                        <Form.Item>
                            {
                                getFieldDecorator('time', {
                                    initialValue: ''
                                }) ( <RangePicker ranges={{ Today: [moment(), moment()], 
                                                'This Month': [moment().startOf('month'), moment().endOf('month')]}} />)
                            }
                        </Form.Item>
                        <Form.Item>
                            <Link to={{pathname: "/search", search: searchURL}}>
                                <Button type="primary" style={{width: 100}} onClick={this.handleSubmit}> Search</Button>
                            </Link>
                        </Form.Item>
                    </Form>
                </div>
                {/* carousel */}
                <Carousel autoplay>
                    <img src="/carousel-img/1.jpg" alt=""/>
                    <img src="/carousel-img/2.jpg" alt="" />
                    <img src="/carousel-img/3.jpeg" alt="" />
                </Carousel>
                {/* space type */}
                <div className="spaceType">
                    <div>
                        <h2 className="spaceTitle">Find the type of space that you like</h2>
                    </div>
                    <Row>
                        {
                            typeImages.map((item, index) => {
                                return (
                                    <Col span={6} key={index}>
                                        <Link to={{pathname: "/search", 
                                                    search: "?location=&type=" + typeOptions[index] + "&start_date=&end_date="}}>
                                            <div style={{textAlign: "center"}} onClick={() => {this.props.search('', typeOptions[index], '', '')}}>
                                                    <img className="typeImage" src={item} alt=""/>
                                            </div>
                                        </Link>
                                        <div className="allTypes">{typeOptions[index]}</div>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </div >
                {/* Recommend hotels */}
                <div className="recommendList">
                    <div>
                        <h2 className="listTitle">Places to stay in Sydney</h2>
                    </div>
                    <Row>
                        {
                            homePropInfo !== null ?
                            homePropInfo.map((item, index) => {
                                if (index !== 0){
                                    const price = item.get('price').split('.')[0]
                                    return (
                                        <Col span={6} key={index}>
                                            <Link to={`/props/${ item.get('property_id')}`}>
                                                <div style={{textAlign: "center"}}>
                                                    <img className="recomImage" src={item.get('image').get(1)} alt=""/>
                                                </div>
                                                <div className="title">{item.get('title')}</div>
                                            </Link>
                                            <div className="location">{item.get('location')}</div>
                                            <p className="price">
                                                <span style={{color: "black", fontSize: 14, fontWeight: "bold"}}>{`${price} AUD `}</span>
                                                <span>/night</span>
                                            </p>
                                        </Col>
                                    )
                                }
                                return null
                            }) : null 
                        }
                    </Row>
                </div>
             </div>
          );
    }

    UNSAFE_componentWillMount(){
        if (localStorage.linkToken){
            this.props.isLogin(localStorage.linkToken)
        }
        if (!this.props.homePropInfo) {
            this.props.getHomeInfo()
        }
    }

}

const mapState = (state) => {
	return {
        loginStatus: state.getIn(["combo", "loginStatus"]),
        userInfo: state.getIn(["combo", "userInfo"]),
        homePropInfo: state.getIn(["combo", "homePropInfo"])
	}
}

const mapDispatch = (dispatch) => ({
    isLogin(token){
        dispatch(actionCreators.isLogin(token))
    },
    getHomeInfo() {
        dispatch(actionCreators.getHomeInfo())
    },
    search(location, house_type, start_date, end_date) {
		dispatch(actionCreators.search(location, house_type, start_date, end_date))
	}
   
});


export default connect(mapState, mapDispatch)(Form.create()(Home));


