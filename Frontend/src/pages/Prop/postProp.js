import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookies'
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import {Form, Button, Input, Radio, Select, DatePicker, 
    Upload, Icon, Modal, message } from 'antd';
import { actionCreators } from '../../redux/oneStore';
import  { axiosPostConfig } from '../../redux/oneStore/actionCreators';
import * as helpers from '../../utils/helpers';
import FourOThree from '../../pages/403';



const { RangePicker } = DatePicker;
const baseURL = helpers.BACKEND_URL;
const actionURL = baseURL + "/upload/"


class Host extends Component{

    state = {
        postPropFlag: 0,
        previewVisible: false,
        previewImage: '',
        fileList: []
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handleChange = ({ fileList }) => this.setState({ fileList });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    postPropSuccess = () => {
        message.success('Post Property Success');
    };

    postPropFailure = (err) => {
        message.error('Post Property Failure: ' + err);
    };

    handleSubmit = (token) => {

        const propURL = baseURL + '/host/';
        this.props.form.validateFields((err, propInfo) => {
            if (!err) {
                let filenames = []
                this.state.fileList.forEach((item) => { filenames.push(item['name']) })
                const start_date = propInfo.available_time[0].format('YYYY-MM-DD');
                const end_date = propInfo.available_time[1].format('YYYY-MM-DD');
                const price = "$" + propInfo.price.toString()
                const propData = {"title": propInfo.title, "type": propInfo.type, "amenities": '{' + propInfo.amenity.toString() + '}', 
                    "price": price, "state": propInfo.state, "suburb": propInfo.suburb, "location": propInfo.location, 
                    "postcode": propInfo.postcode, "bedrooms": propInfo.bedrooms, "bathrooms": propInfo.bathrooms, "accommodates": propInfo.accommodates,
                    "start_date": start_date, "end_date": end_date, "house_rules": propInfo.houseRules,
                    "other_details": propInfo.description, "filename": filenames}

                axios.post(propURL, propData, axiosPostConfig(token)).then((res) => {
                    this.postPropSuccess()
                    this.setState({postPropFlag: 1})
                }).catch((error) => {
                    this.postPropFailure(error.response.data.message)
                }); 

            }
        })
    }

    disabledDate = (current) => {
        return current && current < moment().add(-1, 'days');
    }

    render(){
        const { loginStatus, token } = this.props;
        const { previewVisible, previewImage, fileList } = this.state;
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { xs: 24, sm: 9, xl: 9 },
            wrapperCol: { xs: 16, sm: 9, xl: 6 }
        }
        const typeOptions = ['Apartment', 'Studio', 'House', 'Unit']
        const amenityOptions = ['TV', 'Internet', 'Wifi', 'Washer', 'Dryer', 'Hair dryer', "Self check-in", "Private entrance", 
                'Kitchen', 'Smoke detector', 'Air conditioning', 'Free parking on premises']
        const stateOptions = ['New South Wales', 'Victoria','Queensland', 'South Australia']
        const bedroomNum = ['1', '2', '3', '4', '5', '6']
        const bathroomNum = ['0', '1', '2', '3', '4', '5', '6']
        const guestNum = ['1', '2', '3', '4', '5', '6', '7', '8']

        if (!loginStatus){
            return (<FourOThree subTitle={"Sorry, you are not authorized to access post property page before logining."}/>)
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
                                rules: [{ required: true }]
                            })( <Input placeholder="Please input title"/> )
                        }
                    </Form.Item>
                    <Form.Item label="Type" {...formItemLayout}>
                        {
                            getFieldDecorator('type', {
                                initialValue: 'Apartment',
                                rules: [{ required: true }]
                            })( <Radio.Group>
                                {
                                    typeOptions.map(item => (
                                        <Radio key={item} value={item}>{item}</Radio>
                                    ))
                                }
                                </Radio.Group>)
                        }
                    </Form.Item>
                    <Form.Item label="Photos" {...formItemLayout}>
                        {
                            getFieldDecorator('photos',{
                                initialValue: [],
                                rules: [{ required: true }]
                            })( <div className="clearfix">
                                    <Upload
                                        multiple={true}
                                        action={actionURL}
                                        listType="picture"
                                        fileList={fileList}
                                        onPreview={this.handlePreview}
                                        onChange={this.handleChange}
                                    >
                                    {
                                        fileList.length <= 20 ? 
                                        <Button style={{backgroundColor: "#f0f0f0"}}>
                                            <Icon type="upload" />
                                            Upload Property Photos
                                        </Button> : null
                                    }
                                    </Upload>
                                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                        <img style={{ width: '100%' }} src={previewImage} alt="photos"/>
                                    </Modal>
                                </div>
                            )
                        }
                    </Form.Item>
                    <Form.Item label="Amenities" {...formItemLayout}>
                        {
                            getFieldDecorator('amenity', {
                                initialValue: ['TV'],
                                rules: [{ required: true, message: 'Please select your amenities', type: 'array' }],
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
                                    { required: true },
                                    { pattern: new RegExp("^[1-9][0-9]*$", 'g'), message: 'The input price must be an integer' }
                                ]
                            })(<Input placeholder="Please input the price" prefix="$" suffix="AUD"/>)
                        }
                    </Form.Item>
                    <Form.Item label="State" {...formItemLayout}>
                        {
                            getFieldDecorator('state', {
                                initialValue: undefined,
                                rules: [{ required: true }],
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
                                rules: [{ required: true }]
                            })( <Input placeholder="Maroubra"/>)
                        }
                    </Form.Item>
                    <Form.Item label="Location" {...formItemLayout}>
                        {
                            getFieldDecorator('location', {
                                initialValue: '',
                                rules: [{ required: true }]
                            })( <Input placeholder="Unit 400 140 Maroubra Road"/>)
                        }
                    </Form.Item>
                    <Form.Item label="Postcode" {...formItemLayout}>
                        {
                            getFieldDecorator('postcode', {
                                initialValue: '',
                                rules: [{ required: true }]
                            })( <Input placeholder="2035"/>)
                        }
                    </Form.Item>
                    <Form.Item label="Bedroom number" {...formItemLayout}>
                        {
                            getFieldDecorator('bedrooms', {
                                initialValue: '1',
                                rules: [{ required: true }]
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
                                rules: [{ required: true }]
                            })(<Select allowClear>
                                {
                                    bathroomNum.map(item => (
                                        <Select.Option key={item} value={item}>{item}</Select.Option>
                                    ))
                                }
                                </Select>)
                        }
                    </Form.Item>
                    <Form.Item label="Accommodates" {...formItemLayout}>
                        {
                            getFieldDecorator('accommodates', {
                                initialValue: '1',
                                rules: [{ required: true }]
                            })(<Select allowClear>
                                {
                                    guestNum.map(item => (
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
                                rules: [{ required: true, message: 'Please select available time' }]
                            })( <RangePicker 
                                            disabledDate={this.disabledDate}
                                            format="YYYY-MM-DD" style={{width: "100%"}}
                                            ranges={{ Today: [moment(), moment()], 
                                            'This Month': [moment(), moment().endOf('month')]}} />)
                        }
                    </Form.Item>
                    <Form.Item label="House Rules" {...formItemLayout}>
                        {
                            getFieldDecorator('houseRules',{
                                initialValue: ''
                            })( <Input.TextArea placeholder="Please input house rules" allowClear/> )
                        }
                    </Form.Item>
                    <Form.Item label="Other Detail" {...formItemLayout}>
                        {
                            getFieldDecorator('description',{
                                initialValue: ''
                            })( <Input.TextArea placeholder="Please input other detail" allowClear/> )
                        }
                    </Form.Item>
                    <Form.Item style={{textAlign: "center"}}>
                        <Button type="primary" 
                                onClick={() => this.handleSubmit(token)} 
                                style={{fontWeight: 600}}>Confirm Post
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }

    UNSAFE_componentWillMount(){
        if (cookie.load('userInfo')){
            this.props.isLogin(cookie.load('userInfo'))
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


