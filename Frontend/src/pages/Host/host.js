import React, { Component } from 'react';
import {Form, Button, Input, Radio, Checkbox, Select, 
    Menu, Cascader, DatePicker, TextArea, Icon, message } from 'antd';


const { Option } = Select;
const { RangePicker } = DatePicker;

const plainOptions = ['TV', 'Wi-Fi', 'Gas', 'Air Conditioning', 'Wash Machine', 'Car Park', 'Swimming Pool']

function handleMenuClick(e) {
    message.info('Click on menu item.');
    console.log('click', e);
}


const menu = (
    <Menu onClick={handleMenuClick}>
        <Menu.Item key="1"><Icon type="user" />1st menu item</Menu.Item>
        <Menu.Item key="2"><Icon type="user" />2nd menu item</Menu.Item>
        <Menu.Item key="3"><Icon type="user" />3rd menu item</Menu.Item>
    </Menu>
);

const options1 = [ {value: "Apartment", label: "New South Wales"}, 
                {value: "Studio", label: "New South Wales New South Wales"}, 
                {value: "Unit", label: "New South Wales"}, 
                {value: "House", label: "New South Wales"} ]


class Host extends Component{

    state = {
        value: 'apartment',
        checkedList: [],
    };

    handleSubmit = () => {
        let userInfo = this.props.form.getFieldsValue();
        message.success(`${userInfo.state} available time is：${userInfo.available_time}`)
    }

    radioChange = e => {
        console.log('radio checked', e.target.value);
        this.setState({
          value: e.target.value,
        });
    };

    checkBoxChange = checkedList => {
        this.setState({
          checkedList,
          indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
          checkAll: checkedList.length === plainOptions.length,
        });
    };

    onCheckAllChange = e => {
        this.setState({
          checkedList: e.target.checked ? plainOptions : [],
          indeterminate: false,
          checkAll: e.target.checked,
        });
    };

    onChange(checkedValues) {
        console.log('checked = ', checkedValues);
    }

    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, imageUrl => this.setState({
                userImg: imageUrl,
                loading: false,
            }));
        }
    }

    render(){
        
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { xs: 24, sm: 9, xl: 9 },
            wrapperCol: { xs: 16, sm: 9, xl: 6 }
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
                            })( <Input /> )
                        }
                    </Form.Item>
                    <Form.Item label="Type" {...formItemLayout}>
                        {
                            getFieldDecorator('type', {
                                initialValue: '',
                                rules: [{ required: true, message: 'Please select your property type!' }]
                            })( <Radio.Group onChange={this.radioChange} value={this.state.value}>
                                    <Radio value={'apartment'}>Apartment</Radio>
                                    <Radio value={'studio'}>Studio</Radio>
                                    <Radio value={'house'}>House</Radio>
                                    <Radio value={'unit'}>Unit</Radio>
                                </Radio.Group>)
                        }
                    </Form.Item>
                    <Form.Item label="Facilities" {...formItemLayout}>
                        {
                            getFieldDecorator('facility', {
                                initialValue: '',
                                rules: [{ required: true, message: 'Please select your facilities!' }]
                            })(
                            <Checkbox.Group
                                    options={plainOptions}
                                    value={this.state.checkedList}
                                    onChange={this.checkBoxChange}/>)
                        }
                    </Form.Item>
                    <Form.Item label="Price" {...formItemLayout}>
                        {
                            getFieldDecorator('price', {
                                initialValue: '',
                                rules: [{ required: true, message: 'Please input price!' }]
                            })(<Input addonAfter="$ / Per Day" defaultValue="" />)
                        }
                    </Form.Item>
                    <Form.Item label="State" {...formItemLayout}>
                        {
                            getFieldDecorator('state', {
                                initialValue: '',
                                rules: [{ required: true, message: 'Please select state!' }]
                            })(<Cascader options={options1} onChange={this.onChange}/>)
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
                    <Form.Item label="Bath number" {...formItemLayout}>
                        {
                            getFieldDecorator('bath_num', {
                                initialValue: ''
                            })(<Select onChange={this.onChange}>
                                    <Option value="1">1</Option>
                                    <Option value="2">2</Option>
                                    <Option value="3">3</Option>
                                    <Option value="4">4</Option>
                                </Select>)
                        }
                    </Form.Item>
                    <Form.Item label="Room number" {...formItemLayout}>
                        {
                            getFieldDecorator('room_num', {
                                initialValue: ''
                            })(<Select onChange={this.onChange}>
                                    <Option value="1">1</Option>
                                    <Option value="2">2</Option>
                                    <Option value="3">3</Option>
                                    <Option value="4">4</Option>
                                    <Option value="5">5</Option>
                                    <Option value="6">6</Option>
                                </Select>)
                        }
                    </Form.Item>
                    <Form.Item label="CarPark number" {...formItemLayout}>
                        {
                            getFieldDecorator('carpark_num', {
                                initialValue: ''
                            })( <Select onChange={this.onChange}>
                                    <Option value="0">0</Option>
                                    <Option value="1">1</Option>
                                    <Option value="2">2</Option>
                                    <Option value="3">3</Option>
                                </Select>)
                        }
                    </Form.Item>
                    <Form.Item label="Available Time" {...formItemLayout}>
                        {
                            getFieldDecorator('available_time', {
                                initialValue: '',
                                rules: [{ required: true, message: 'Please input available time!' }]
                            })(<RangePicker className="searchInner" onChange={this.onChange} />)
                        }
                    </Form.Item>
                    <Form.Item label="Other Detail" {...formItemLayout}>
                        {
                            getFieldDecorator('detail',{
                                initialValue: ''
                            })( <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} /> )
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


