import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { Form, Row, Col, Carousel, DatePicker, Cascader, Button, Select, message} from 'antd';
import { actionCreators } from './store';
import './index.less';


const { Option } = Select;
const { RangePicker } = DatePicker;


class Home extends Component {

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.props.search(values.type, values.location, values.time)
            }
            message.error('Please select location!')
        })
    }
    

    render() {
        
        const { getFieldDecorator } = this.props.form;

        const typeOptions = ['Apartment', 'Loft', 'House', 'Unit']
        const locationOptions = [
            {
                value: 'NSW', label: 'NSW',
                children: [
                    { value: 'Nanjing', label: 'Nanjing'}
                ]
            }
        ];

        return (
            <div className="content" >
                <div className="contentUp">
                    {
                        this.props.loginStatus ?
                        <h1 className="book">Hi {this.props.userInfo.get("username")}, Welcome to book your trip!</h1> :
                        <h1 className="book">Welcome to book your trip!</h1>
                    }
                     <Form layout="inline" className="homeSearchModule" onSubmit={this.handleSubmit}>
                        <Form.Item>
                            {
                                getFieldDecorator('location', {
                                    initialValue: '',
                                    rules: [
                                        { required: true }
                                    ]
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
                                })
                                (<RangePicker/>)
                                // ( <RangePicker format="YYYY-MM-DD" 
                                //                 ranges={{ Today: [moment(), moment()], 
                                //                 'This Month': [moment().startOf('month'), moment().endOf('month')]}} />)
                            }
                        </Form.Item>
                        <Form.Item>
                            <Link to='/search'><Button type="primary" style={{width: 100}}> Search</Button></Link>
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
                            this.props.allPropInfo !== null ?
                            this.props.allPropInfo.map((item, index) => {
                                if (index !== 0){
                                    const price = item.get("price").split('.')[0]
                                    return (
                                        <Col span={4} key={index}>
                                            <div style={{textAlign: "center"}}><img src={item.get("image")[0]} alt=""/></div>
                                            <div className="title">{item.get("title")}</div>
                                            <div style={{textAlign: "center", marginBottom: 2}}>{item.get("location")}</div>
                                            <div style={{textAlign: "center", marginBottom: 25}}>{`${price} per/night`}</div>
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
        this.props.getAllPropInfo();
    }
}

const mapState = (state) => {
	return {
        loginStatus: state.getIn(["login", "loginStatus"]),
        userInfo: state.getIn(["login", "userInfo"]),
        allPropInfo: state.getIn(["home", "allPropInfo"]),
	}
}

const mapDispatch = (dispatch) => ({
    getAllPropInfo() {
		dispatch(actionCreators.getAllPropInfo())
	}
    
});


export default connect(mapState, mapDispatch)(Form.create()(Home));

