import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col, Button, Card, Drawer, Input, Modal, Avatar, Icon} from 'antd';
import { actionCreators } from '../../redux/oneStore';
import './request.less';


const { confirm } = Modal;

class Request extends Component {

    state = {
        drawerVisible: false
    };

    handleSubmit = (token) => {
        let request = this.props.form.getFieldsValue()
        this.props.postRequest(token, request.title, request.content)
    }

    confirmDeleteRequest = (token, req_id) => {
        let deleteRequestThis = this
        confirm({
            title: 'Do you want to delete this request?',
            cancelText: 'No',
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(function(){
                        resolve();
                    }, 500)
                }).then(() => { 
                    deleteRequestThis.props.deleteRequest(token, req_id)
                }).catch((reject) => console.log(reject));
            },
            onCancel() { },
        });
    }

    render() {
        const { token, allRequests } = this.props;
        const { getFieldDecorator } = this.props.form;

        return (
            <div className="requestContent">
                <div className="requestTitle">
                    Visitor Requests
                </div>
                <div style={{ background: '#ECECEC', padding: '20px' }}>
                    <div className="addRequestWrap" >
                        <Button className="currentRequest">Current Requests</Button>
                        <Button icon="plus"
                                type="primary"
                                className="addRequest"
                                onClick={ () => { this.setState({ drawerVisible: true }) } }>
                            Add a new request
                        </Button>
                    </div>
                    <Row gutter={16}>
                        {   
                            allRequests !== null ?
                            allRequests.map((item, index) => {
                                return (
                                    <div key={item}>
                                        <Col span={3}>
                                            <div className="requestAvatarWrap">
                                                <Avatar size={108} src={item.get("avatar")}/>
                                                <div className="requestName">{item.get("user_name")}</div>
                                            </div>
                                        </Col>
                                        <Col span={21} className="oneRequest" >
                                            <Card title={item.get("request_title")}
                                                extra={<div className="deleteRequest"
                                                            onClick={() => this.confirmDeleteRequest(token, item.get("req_id"))}>
                                                            <Icon type="delete"  style={{ fontSize: '20px', color: "#1890ff" }}/>
                                                        </div>}>
                                                {item.get("request_content")}
                                                <div style={{marginTop: "20px", color: "#d48806"}}>
                                                    <span>
                                                        Posted by {item.get("user_name")} at {item.get("request_time")}
                                                    </span>
                                                    <span style={{float: "right", fontSize: '18px', color: "#1890ff"}}>
                                                        <Icon type="message" />
                                                    </span>
                                                </div>
                                            </Card>
                                        </Col>
                                    </div>
                                )
                            }) : null
                        }
                    </Row>
                </div>
                <Drawer
                    title="Post Request"
                    width={520}
                    placement={'left'}
                    headerStyle={{height: 58}}
                    onClose={() => { this.setState({ drawerVisible: false })}}
                    visible={this.state.drawerVisible}>

                    <Form layout="horizontal"  style={{}}>
                        <Form.Item label="Title"> 
                            {
                                getFieldDecorator('title',{ 
                                    initialValue:'', 
                                    rules:[ { required: true, message: 'Please input request title!' }]
                                })( <Input allowClear/> )
                            }
                        </Form.Item>
                        <Form.Item label="Description">
                            {
                                getFieldDecorator('content', {
                                    initialValue: '',
                                    rules: [ { required: true, message: 'Please input request description!' }, ]
                                })( <Input.TextArea rows={8} allowClear/> )
                            }
                        </Form.Item>
                    </Form>
                    <div className="requestNotes">
                        Notes: In order to help you better, you need to provide as much information as possible!
                    </div>
                    <div className="drawerTextArea">
                        <Button style={{ marginRight: 8 }} onClick={() => { this.setState({ drawerVisible: false })} }>Cancel</Button>
                        <Button onClick={() => { this.setState({ drawerVisible: false }); this.handleSubmit(token)} } type="primary">Submit</Button>
                    </div>
                </Drawer>
            </div>
        );
    }


    UNSAFE_componentWillMount(){
        this.props.getRequests()
    }
}

const mapState = (state) => {
	return {
        token: state.getIn(["combo", "token"]),
        allRequests: state.getIn(["combo", "allRequests"])
	}
}

const mapDispatch = (dispatch) => ({
    getRequests() {
        dispatch(actionCreators.getRequests())
    },
    postRequest(token, title, content) {
        dispatch(actionCreators.postRequest(token, title, content))
    },
    deleteRequest(token, req_id) {
        dispatch(actionCreators.deleteRequest(token, req_id))
    }
});


export default connect(mapState, mapDispatch)(Form.create()(Request));
