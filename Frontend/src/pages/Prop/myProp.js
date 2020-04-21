import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookies'
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Row, Col, Button, Icon, Card, Modal, Drawer, 
    Form, Input, DatePicker, Upload, Select, Empty, message} from 'antd';
import * as helpers from '../../utils/helpers';
import { actionCreators } from '../../redux/oneStore';
import FourOThree from '../../pages/403';
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
        currenPropId: null,
        currenPropPrice: 0,
        currenPropTitle: '',
        currenPropAmenities: ['TV', 'Internet', 'Wifi', 'Washer', 'Dryer'],
        currenPropRules: '',
        currenPropDetails: '',
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
                let price = '';
                if (propInfo.price) {
                    price = "$" + propInfo.price.toString()
                }
                const propData = {"title": propInfo.title, "amenities": '{' + propInfo.amenity.toString() + '}', 
                        "price": price, "start_date": start_date, "end_date": end_date, 
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

    disabledDate = (current) => {
        return current && current < moment().add(-1, 'days');
    }

    showDrawer = (item) => {
        this.setState({ 
            drawerVisible: true, 
            currenPropId: item.get('property_id'),
            currenPropPrice: item.get('price').split('$')[1].split('.')[0],
            currenPropTitle: item.get('title'),
            currenPropRules: item.get('house_rules'),
            currenPropDetails: item.get('description'),
        })
    }


    render() {
        const { loginStatus, token, allProps } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { previewVisible, previewImage, fileList, 
            currenPropPrice, currenPropTitle, currenPropAmenities, currenPropRules, currenPropDetails,  } = this.state;

        const amenityOptions = ['TV', 'Internet', 'Wifi', 'Washer', 'Dryer', 
            'Hair dryer', 'Kitchen', 'Smoke detector', 'Air Conditioning', 'Free parking on premises']

        if (!loginStatus){
            return (<FourOThree subTitle={"Sorry, you are not authorized to access user current properties page before logining."}/>)
        }

        return (
            <div className="myPropContent">
                <div className="propTitle">
                    My Properties
                </div>
                <div style={{ background: '#ECECEC', padding: '20px' }}>
                    <div className="addPropertyWrap" >
                        <Button className="currentProperty">Current Properties</Button>
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
                            allProps.size === 0 ? 
                            <Empty description={<span><Icon type="frown" theme="twoTone"/> so sad, no property!</span>} 
                                   style={{marginTop: 50, marginBottom: 30, fontSize: 22}}/> : 
                            allProps.map((item, index) => {
                                const price = item.get('price').split('.')[0]
                                return (
                                    <Col span={12} key={index} style={{marginBottom: "30px", paddingLeft: "4%"}}>
                                        <Card
                                            style={{ width: "90%" }}
                                            cover={ <img alt="" src={item.get('img_url')} style={{width: "100%", height: 310}}/> }
                                            actions={[
                                                <Icon type="edit" 
                                                    key="edit"
                                                    style={{fontSize: "20px", color: "#f9c700"}}
                                                    onClick={ () => this.showDrawer(item) }
                                                    />, 
                                                <Icon type="delete" 
                                                    key="delete"
                                                    style={{fontSize: "20px", color: "#f9c700"}}
                                                    onClick={() => this.confirmDeleteProperty(token, item.get('property_id'))}/> 
                                            ]}>
                                            <Link to={`/props/${ item.get('property_id')}`}>
                                                <Meta
                                                    title={<div>
                                                            <div style={{float: "left", paddingBottom: "5%"}}>{item.get('title')}</div>
                                                            <div style={{float: "right"}}>
                                                                <span style={{marginRight: "1%", color: "#ad6800", fontWeight: "bold"}}>{price}</span>
                                                                <span style={{fontSize: "12px", marginTop: "1.5%"}}> AUD/night</span>
                                                            </div>
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
                                initialValue: currenPropTitle, 
                                rules:[ ]
                            })( <Input allowClear/> )
                        }
                        </Form.Item>
                        <Form.Item label="Amenities" >
                        {
                            getFieldDecorator('amenity', {
                                initialValue: currenPropAmenities,
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
                                    initialValue: currenPropPrice,
                                    rules: [{ pattern: new RegExp("^[1-9][0-9]*$", 'g'), message: 'The input price must be an integer' }]
                                })(<Input placeholder="Please input the price" prefix="$" suffix="AUD"/>)
                            }
                        </Form.Item>
                        <Form.Item label="Available Time">
                            {
                                getFieldDecorator('available_time', {
                                    initialValue: '',
                                    rules: []
                                })( <RangePicker 
                                                disabledDate={this.disabledDate}
                                                format="YYYY-MM-DD" style={{width: "100%"}}
                                                ranges={{ Today: [moment(), moment()], 
                                                'This Month': [moment(), moment().endOf('month')]}} />)
                            }
                        </Form.Item>
                        <Form.Item label="House Rules">
                            {
                                getFieldDecorator('houseRules',{
                                    initialValue: currenPropRules,
                                })( <Input.TextArea Rows={5} placeholder="Please input house rules" allowClear/> )
                            }
                        </Form.Item>
                        <Form.Item label="Other Detail">
                        {
                            getFieldDecorator('description',{
                                initialValue: currenPropDetails,
                            })( <Input.TextArea Rows={5} placeholder="Please input other detail" allowClear/> )
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
        if (cookie.load('userInfo')){
            this.props.isLogin(cookie.load('userInfo'))
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

