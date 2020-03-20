import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import { Form, Row, Col, Button, Select, Carousel, 
    DatePicker, Cascader, message} from 'antd';
import { actionCreators } from '../../redux/oneStore';
import './index.less';


const { Option } = Select;
const { RangePicker } = DatePicker;
const baseURL = 'http://127.0.0.1:5000';


class Home extends Component {

    state = {
        homePropInfo: null
    };

    locationTips = () => {
        message.error('Please select a location!');
    };

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if(!err){
                if (values.type === undefined) {
                    var house_type = '';
                } else {
                    house_type = values.type;
                }
                if (values.time === '' || values.time[0] === undefined) {
                    var start_date = '';
                    var end_date = '';
                } else {
                    start_date = values.time[0].format('YYYY-MM-DD');
                    end_date = values.time[1].format('YYYY-MM-DD');
                }
                if (values.location === '' || values.location === undefined ) {
                    var location = '';
                } else {
                    location = values.location[1];
                }
                this.props.search(location, house_type, start_date, end_date)
            }
        })
    }
    
    render() {

        const { getFieldDecorator } = this.props.form;

        const typeOptions = ['Apartment', 'Studio', 'House', 'Unit']
        let locationOptions = []
        if (this.state.homePropInfo !== null){
            let states = this.state.homePropInfo[0].state
            for (let key in states){
                let suburb = []
                states[key].map((val) => {
                    suburb.push({value: val, label: val})
                    return null
                })
                locationOptions.push({value: key, label: key, children: suburb })
            }
        }


        return (
            <div className="content" >
                <div className="contentUp">
                    {
                        this.props.loginStatus ?
                        <h1 className="book">Hi {this.props.userInfo.get("username")}, Welcome to book your trip!</h1> :
                        <h1 className="book">Welcome to book your trip!</h1>
                    }
                     <Form layout="inline" className="homeSearchModule">
                        <Form.Item>
                            {
                                getFieldDecorator('location', {
                                    initialValue: '',
                                    rules: []
                                })(<Cascader className="searchInner" options={locationOptions} placeholder="Select location" />)
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
                            <Link to='/search'>
                                <Button type="primary" style={{width: 100}} onClick={this.handleSubmit}> Search</Button>
                            </Link>
                        </Form.Item>
                    </Form>
                </div>
                {/* carousel */}
                <Carousel autoplay>
                    <div><img src="/carousel-img/1.jpg" alt=""/></div>
                    <div><img src="/carousel-img/2.jpg" alt="" /></div>
                    <div><img src="/carousel-img/3.jpeg" alt="" /></div>
                </Carousel>
                {/* space type */}
                <div className="spaceType">
                    <div>
                        <h2 className="spaceTitle">Find the type of space that you like</h2>
                    </div>
                    <Row className="typePics">
                        <Col span={6}>
                            <div style={{textAlign: "center"}}><img src="/space-type/house.png" alt=""/></div>
                            <div className="allTypes">House</div>
                        </Col>
                        <Col span={6}>
                            <div style={{textAlign: "center"}}><img src="/space-type/apartment.png" alt=""/></div>
                            <div className="allTypes">Apartment</div>
                        </Col>
                        <Col span={6}>
                            <div style={{textAlign: "center"}}><img src="/space-type/studio.png" alt=""/></div>
                            <div className="allTypes">Studio</div>
                        </Col>
                        <Col span={6}>
                            <div style={{textAlign: "center"}}><img src="/space-type/unit.png" alt=""/></div>
                            <div className="allTypes">Unit</div>
                        </Col>
                    </Row>
                </div >
                {/* Recommend hotels */}
                <div className="recommendList">
                    <div>
                        <h2 className="listTitle">Places to stay in Sydney</h2>
                    </div>
                    <Row>
                        {
                            this.state.homePropInfo !== null ?
                            this.state.homePropInfo.map((item, index) => {
                                if (index !== 0){
                                    const price = item.price.split('.')[0]
                                    return (
                                        <Col span={4} key={index}>
                                            <div style={{textAlign: "center"}}><img src={item.image[0]} alt=""/></div>
                                            <div className="title">{item.title}</div>
                                            <div style={{textAlign: "center", marginBottom: 2}}>{item.location}</div>
                                            <div style={{textAlign: "center", marginBottom: 25}}>{`${price} AUD/night`}</div>
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
        const URL = baseURL + '/home/';
        const config = { headers: { "accept": "application/json" } };
        axios.get(URL, config).then((res) => {
            this.setState({
				homePropInfo: res.data
			})
        }).catch(() => {
            console.log('Get home property data failure');
        })
        
    }
}

const mapState = (state) => {
	return {
        loginStatus: state.getIn(["combo", "loginStatus"]),
        userInfo: state.getIn(["combo", "userInfo"])
	}
}

const mapDispatch = (dispatch) => ({
    search(location, house_type, start_date, end_date) {
		dispatch(actionCreators.search(location, house_type, start_date, end_date))
	}
   
});


export default connect(mapState, mapDispatch)(Form.create()(Home));


