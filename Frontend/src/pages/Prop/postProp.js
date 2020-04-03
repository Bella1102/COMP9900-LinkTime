import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import {Form, Button, Input, Radio, Select, DatePicker, message } from 'antd';
import { actionCreators } from '../../redux/oneStore';
import * as helpers from '../../utils/helpers';


const { RangePicker } = DatePicker;
const baseURL = helpers.BACKEND_URL;


class Host extends Component{

    state = {
        postPropFlag: 0
    }

    propSuccess = () => {
        message.success('Post Property Success');
    };

    propFailure = (err) => {
        message.error('Post Property Failure: ' + err);
    };

    render(){
        const { token } = this.props;
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { xs: 24, sm: 9, xl: 9 },
            wrapperCol: { xs: 16, sm: 9, xl: 6 }
        }
        const typeOptions = ['Apartment', 'Studio', 'House', 'Unit']
        const amenityOptions = ['TV', 'Internet', 'Wifi', 'Washer', 'Dryer', 
                                'Hair dryer', 'Kitchen', 'Smoke detector', 'Air Conditioning', 'Free parking on premises']
        const stateOptions = ['New South Wales', 'Victoria','Queensland', 'South Australia']
        const bedroomNum = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
        const bathroomNum = ['0', '1', '2', '3', '4', '5', '6']

        const handleSubmit = () => {
        
            let propInfo = this.props.form.getFieldsValue();
            const propURL = baseURL + '/host/';
            const axiosConfig = {
                headers: {
                    "accept": "application/json",
                    'Content-Type':'application/json',
                    "Authorization": token
                }
            };
            const start_date = propInfo.available_time[0].format('YYYY-MM-DD');
            const end_date = propInfo.available_time[1].format('YYYY-MM-DD');
            const propData = {"title": propInfo.title, "type": propInfo.type, "amenities": '{' + propInfo.amenity.toString() + '}', 
                            "price": propInfo.price, "state": propInfo.state, "suburb": propInfo.suburb, 
                            "location": propInfo.location, "postcode": propInfo.postcode, "bedrooms": propInfo.bedrooms, 
                            "bathrooms": propInfo.bathrooms, "start_date": start_date, "end_date": end_date, "other_details": propInfo.description}
                            
            axios.post(propURL, propData, axiosConfig).then((res) => {
                this.propSuccess()
                this.setState({postPropFlag: 1})
            }).catch((error) => {
                this.propFailure(error.response.data.message)
            }); 
        }

        if (this.state.postPropFlag){
            return (<Redirect to="/myProps" />)
        }
      
        return (
            <div style={{minHeight: 900}}>
                <h1 style={{textAlign: "center", marginTop: 60, fontWeight: 600}}>Post your property</h1>
                <Form layout="horizontal" style={{marginTop: 30, minHeight: 600}}>
                    <Form.Item label="Title" {...formItemLayout}>
                        {
                            getFieldDecorator('title', {
                                initialValue: '',
                                rules: [{ required: true, message: 'Please input title!' }]
                            })( <Input placeholder="Please input title"/> )
                        }
                    </Form.Item>
                    <Form.Item label="Type" {...formItemLayout}>
                        {
                            getFieldDecorator('type', {
                                initialValue: 'Apartment',
                                rules: [{ required: true, message: 'Please select property type!' }]
                            })( <Radio.Group>
                                {
                                    typeOptions.map(item => (
                                        <Radio key={item} value={item}>{item}</Radio>
                                    ))
                                }
                                </Radio.Group>)
                        }
                    </Form.Item>

                    <Form.Item label="Amenities" {...formItemLayout}>
                        {
                            getFieldDecorator('amenity', {
                                initialValue: [],
                                rules: [{ required: true, message: 'Please select your amenities!', type: 'array' }],
                            })( <Select mode="multiple" placeholder='Please select amenities' allowClear>
                                {
                                    amenityOptions.map(item => (
                                        <Select.Option key={item} value={item}>{item}</Select.Option>
                                    ))
                                }
                                </Select>)
                        }
                    </Form.Item>
                    <Form.Item label="Price" {...formItemLayout}>
                        {
                            getFieldDecorator('price', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: 'Please input price!' },
                                    { pattern: new RegExp("^\\$[1-9][0-9]*$", 'g'), message: 'The input price format is not Valid!' }
                                ]
                            })(<Input placeholder="$100"/>)
                        }
                    </Form.Item>
                    <Form.Item label="State" {...formItemLayout}>
                        {
                            getFieldDecorator('state', {
                                initialValue: undefined,
                                rules: [{ required: true, message: 'Please select your state!' }],
                            })( <Select allowClear placeholder='Please select state'>
                                    {
                                        stateOptions.map(item => (
                                            <Select.Option key={item} value={item}>{item}</Select.Option>
                                        ))
                                    }
                                </Select>)
                        }
                    </Form.Item>
                    <Form.Item label="Suburb" {...formItemLayout}>
                        {
                            getFieldDecorator('suburb', {
                                initialValue: '',
                                rules: [{ required: true, message: 'Please input suburb!' }]
                            })( <Input placeholder="Maroubra"/>)
                        }
                    </Form.Item>
                    <Form.Item label="Location" {...formItemLayout}>
                        {
                            getFieldDecorator('location', {
                                initialValue: '',
                                rules: [{ required: true, message: 'Please input location!' }]
                            })( <Input placeholder="Unit 400 140 Maroubra Road"/>)
                        }
                    </Form.Item>
                    <Form.Item label="Postcode" {...formItemLayout}>
                        {
                            getFieldDecorator('postcode', {
                                initialValue: '',
                                rules: [{ required: true, message: 'Please input postcode!' }]
                            })( <Input placeholder="2035"/>)
                        }
                    </Form.Item>
                    <Form.Item label="Bedroom number" {...formItemLayout}>
                        {
                            getFieldDecorator('bedrooms', {
                                initialValue: '1',
                                rules: [{ required: true, message: 'Please select bedroom number!' }]
                            })(<Select allowClear>
                                {
                                    bedroomNum.map(item => (
                                        <Select.Option key={item} value={item}>{item}</Select.Option>
                                    ))
                                }
                                </Select>)
                        }
                    </Form.Item>
                    <Form.Item label="Bathroom number" {...formItemLayout}>
                        {
                            getFieldDecorator('bathrooms', {
                                initialValue: '1',
                                rules: [{ required: true, message: 'Please select bathroom number!' }]
                            })(<Select allowClear>
                                {
                                    bathroomNum.map(item => (
                                        <Select.Option key={item} value={item}>{item}</Select.Option>
                                    ))
                                }
                                </Select>)
                        }
                    </Form.Item>
                    <Form.Item label="Available Time" {...formItemLayout}>
                        {
                            getFieldDecorator('available_time', {
                                initialValue: '',
                                rules: [{ required: true, message: 'Please select available time!' }]
                            })( <RangePicker format="YYYY-MM-DD" style={{width: "100%"}}
                                             ranges={{ Today: [moment(), moment()], 
                                             'This Month': [moment().startOf('month'), moment().endOf('month')]}} />)
                        }
                    </Form.Item>
                    <Form.Item label="Other Detail" {...formItemLayout}>
                        {
                            getFieldDecorator('description',{
                                initialValue: ''
                            })( <Input.TextArea placeholder="Please input other detail"
                                                allowClear/> )
                        }
                    </Form.Item>

                    <Form.Item style={{textAlign: "center"}}>
                        <Button type="primary" 
                                onClick={handleSubmit} 
                                style={{fontWeight: 600}}>Confirm Post
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }

    UNSAFE_componentWillMount(){
        if (localStorage.linkToken){
            this.props.isLogin(localStorage.linkToken)
        }
    }
}


const mapState = (state) => {
	return {
        loginStatus: state.getIn(["combo", "loginStatus"]),
        token: state.getIn(["combo", "token"]),
	}
}

// 把store的dispatch方法挂载到props上
const mapDispatch = (dispatch) => ({
    isLogin(token){
        dispatch(actionCreators.isLogin(token))
    },
});


export default connect(mapState, mapDispatch)(Form.create()(Host));


