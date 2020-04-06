import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Row, Col, Button, Icon, Card, Modal, 
    Drawer, Form, Input, DatePicker, Upload, Select, message} from 'antd';
import * as helpers from '../../utils/helpers';
import { actionCreators } from '../../redux/oneStore';
import './myProp.less';


const { Meta } = Card;
const { confirm } = Modal;
const { RangePicker } = DatePicker;
const baseURL = helpers.BACKEND_URL;
const actionURL = baseURL + "/upload/"


class MyProp extends Component {

    state = {
        drawerVisible: false,
        previewVisible: false,
        previewImage: '',
        fileList: [],
        currenPropId: null
    };

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

    confirmDeleteProperty = (token, property_id) => {
        let deletePropertyThis = this
        confirm({
            title: 'Do you want to delete this property?',
            cancelText: 'No',
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(function(){
                        resolve();
                    }, 500)
                }).then(() => { 
                    deletePropertyThis.props.deleteProperty(token, property_id)
                }).catch((reject) => console.log(reject));
            },
            onCancel() { },
        });
    }

    updateNoArguement = () => {
        message.error('no update information provided');
    };

    handleUpdateSubmit = (token) => {

        this.props.form.validateFields((err, propInfo) => {
            if(!err){
                let filenames = []
                this.state.fileList.forEach((item) => { filenames.push(item['name']) })
                let start_date = ""
                let end_date = ""
                if (propInfo.available_time) {
                    start_date = propInfo.available_time[0].format('YYYY-MM-DD');
                    end_date = propInfo.available_time[1].format('YYYY-MM-DD');
                }
                const propData = {"title": propInfo.title, "amenities": '{' + propInfo.amenity.toString() + '}', 
                        "price": propInfo.price, "start_date": start_date, "end_date": end_date, 
                        "house_rules": propInfo.houseRules, "other_details": propInfo.description, "filename": filenames}
                
                if (propInfo.title || propInfo.amenity.length || propInfo.price || propInfo.available_time || propInfo.houseRules || propInfo.description || filenames.length) {
                    this.props.updateProperty(token, this.state.currenPropId, propData)
                    this.setState({ drawerVisible: false })
                } else {
                    this.updateNoArguement()
                }
            }
        })
    }


    render() {
        const { token, allProps } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { previewVisible, previewImage, fileList } = this.state;

        const amenityOptions = ['TV', 'Internet', 'Wifi', 'Washer', 'Dryer', 
            'Hair dryer', 'Kitchen', 'Smoke detector', 'Air Conditioning', 'Free parking on premises']

        return (
            <div className="myPropContent">
                <div className="propTitle">
                    My Properties
                </div>
                <div style={{ background: '#ECECEC', padding: '20px' }}>
                    <div className="addPropertyWrap" >
                        <Button className="currentProperty">Current Property</Button>
                        <Link to="/postProp">
                            <Button icon="plus"
                                    type="primary"
                                    className="addProperty">
                                Add a new property
                            </Button>
                        </Link>
                    </div>
                    <Row>
                        {   
                            allProps !== null ?
                            allProps.map((item, index) => {
                                const price = item.get('price').split('.')[0]
                                return (
                                    <Col span={12} key={index} style={{marginBottom: "10px"}}>
                                        <Card
                                            style={{ width: "90%" }}
                                            cover={ <img alt="" src={item.get('img_url')}/> }
                                            actions={[
                                                <Icon type="edit" 
                                                    key="edit"
                                                    style={{fontSize: "20px", color: "#f9c700"}}
                                                    onClick={ () => { this.setState({ drawerVisible: true, currenPropId: item.get('property_id') }) }}
                                                    />, 
                                                <Icon type="delete" 
                                                    key="delete"
                                                    style={{fontSize: "20px", color: "#f9c700"}}
                                                    onClick={() => this.confirmDeleteProperty(token, item.get('property_id'))}/> 
                                            ]}>
                                            <Link to={`/props/${ item.get('property_id')}`}>
                                                <Meta
                                                    title={<div>{item.get('title')}
                                                                <span style={{float: "right", fontWeight: "normal"}}> AUD/night</span>
                                                                <span style={{float: "right", marginRight: "1%", color: "#ad6800", fontWeight: "bold"}}>{price}</span>
                                                            </div>}
                                                    description={item.get('location')}
                                                />
                                            </Link>
                                        </Card>
                                    </Col>
                                )
                            }) : null
                        }
                    </Row> 
                </div>
                <Drawer
                    title="Update Property Information"
                    width={520}
                    headerStyle={{height: 58}}
                    onClose={() => { this.setState({ drawerVisible: false })}}
                    visible={this.state.drawerVisible}>

                    <Form style={{}}>
                        <Form.Item label="Photos" >
                        {
                            getFieldDecorator('photos',{
                                initialValue: [],
                                rules: [ ]
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
                                        fileList.length <= 9 ? 
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
                        <Form.Item label="Title"> 
                        {
                            getFieldDecorator('title',{ 
                                initialValue:'', 
                                rules:[ ]
                            })( <Input allowClear/> )
                        }
                        </Form.Item>
                        <Form.Item label="Amenities" >
                        {
                            getFieldDecorator('amenity', {
                                initialValue: [],
                                rules: [ ],
                            })( <Select mode="multiple" placeholder='Please select amenities' allowClear>
                                {
                                    amenityOptions.map(item => (
                                        <Select.Option key={item} value={item}>{item}</Select.Option>
                                    ))
                                }
                                </Select>)
                        }
                        </Form.Item>
                        <Form.Item label="Price">
                            {
                                getFieldDecorator('price', {
                                    initialValue: '',
                                    rules: [{ pattern: new RegExp("^\\$[1-9][0-9]*$", 'g'), message: 'The input price format is not Valid!' }]
                                })(<Input placeholder="$100"/>)
                            }
                        </Form.Item>
                        <Form.Item label="Available Time">
                            {
                                getFieldDecorator('available_time', {
                                    initialValue: '',
                                    rules: []
                                })( <RangePicker format="YYYY-MM-DD" style={{width: "100%"}}
                                                ranges={{ Today: [moment(), moment()], 
                                                'This Month': [moment().startOf('month'), moment().endOf('month')]}} />)
                            }
                        </Form.Item>
                        <Form.Item label="House Rules">
                            {
                                getFieldDecorator('houseRules',{
                                    initialValue: ''
                                })( <Input.TextArea placeholder="Please input house rules" allowClear/> )
                            }
                        </Form.Item>
                        <Form.Item label="Other Detail">
                        {
                            getFieldDecorator('description',{
                                initialValue: ''
                            })( <Input.TextArea placeholder="Please input other detail" allowClear/> )
                        }
                        </Form.Item>
                    </Form>
                    <div className="updatePropertyNotes">
                        Notes: Only part of the property information is allowed to be updated！
                    </div>
                    <div className="drawerTextArea">
                        <Button style={{ marginRight: 8 }} onClick={() => { this.setState({ drawerVisible: false })} }>Cancel</Button>
                        <Button onClick={() => { this.handleUpdateSubmit(token)} } type="primary">Submit</Button>
                    </div>
                </Drawer>
            </div>
        );
    }

    UNSAFE_componentWillMount(){
        if (localStorage.linkToken){
            this.props.isLogin(localStorage.linkToken)
        }
        this.props.getUserInfo(this.props.token)
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
    getUserInfo(token) {
        dispatch(actionCreators.getUserInfo(token))
    },
    deleteProperty(token, property_id) {
        dispatch(actionCreators.deleteProperty(token, property_id))
    },
    updateProperty(token, property_id, propData) {
        dispatch(actionCreators.updateProperty(token, property_id, propData))
    }  
    
});


export default connect(mapState, mapDispatch)(Form.create()(MyProp));

