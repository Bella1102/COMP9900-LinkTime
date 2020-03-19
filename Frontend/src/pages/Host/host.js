import React, { Component } from 'react';
import axios from 'axios';
import {Form, Button, Input, Radio, Select, DatePicker, message } from 'antd';


const baseURL = 'http://127.0.0.1:5000';


class Host extends Component{

    propSuccess = () => {
        message.success('Post Property Success');
    };

    propFailure = () => {
        message.error('Post Property Failure');
    };

    handleSubmit = () => {
        
        let propInfo = this.props.form.getFieldsValue();
        const propURL = baseURL + '/host/';
        const axiosConfig = {
            headers: {
                "accept": "application/json",
                'Content-Type':'application/json'
            }
        };
        const rangeValue = propInfo.available_time;
        const start_time = rangeValue[0].format('YYYY-MM-DD');
        const end_time = rangeValue[1].format('YYYY-MM-DD');
        const propData = {"title": propInfo.title, "property_type": propInfo.type, "amenities": propInfo.amenity, 
                        "price": propInfo.price, "state": propInfo.state, "suburb": propInfo.suburb, 
                        "locaion": propInfo.locaion, "postcode": propInfo.postcode, "bedrooms": propInfo.bedrooms, 
                        "barhtooms": propInfo.bathrooms, "start_time": start_time, "end_time": end_time, "description": propInfo.description}
        axios.post(propURL, propData, axiosConfig).then((res) => {
            console.log(res)
            this.propSuccess()
        }).catch(() => {
            this.propFailure()
        }); 
    }

    checkPrice = (rule, value, callback) => {
        if (value.number > 0) {
          return callback();
        }
        callback('Price must greater than zero!');
      };


    render(){
        
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { xs: 24, sm: 9, xl: 9 },
            wrapperCol: { xs: 16, sm: 9, xl: 6 }
        }
        const typeOptions = ['Apartment', 'Loft', 'House', 'Unit']
        const amenityOptions = ['TV', 'Internet', 'Wifi', 'Washer', 'Dryer', 
                                'Hair dryer', 'Kitchen', 'Smoke detector', 'Air Conditioning', 'Free parking on premises']
        const stateOptions = ['New South Wales', 'Victoria','Queensland', 'South Australia']
        const bedroomNum = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
        const bathroomNum = ['0', '1', '2', '3', '4', '5', '6']

      
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
                                rules: [{ required: true, message: 'Please input available time!' }]
                            })(<DatePicker.RangePicker style={{width: '100%'}} />)
                        }
                    </Form.Item>
                    <Form.Item label="Other Detail" {...formItemLayout}>
                        {
                            getFieldDecorator('description',{
                                initialValue: ''
                            })( <Input.TextArea autoSize={{ minRows: 2, maxRows: 5 }} placeholder="Please input other detail"/> )
                        }
                    </Form.Item>

                    <Form.Item style={{textAlign: "center"}}>
                        <Button type="primary" 
                                onClick={this.handleSubmit} 
                                style={{fontWeight: 600}}>Confirm Post
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}


export default Form.create()(Host);


