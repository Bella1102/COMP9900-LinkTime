import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookies'
import moment from 'moment';
import { Form, Row, Col, Button, Card, Drawer, Input, 
    Modal, Avatar, Icon, Tooltip, Comment, List } from 'antd';
import { actionCreators } from '../../redux/oneStore';
import './request.less';


const { confirm } = Modal;
const { TextArea } = Input;



class Request extends Component {

    state = {
        drawerVisible: false,
        commentValue: '',
        commentSubmitting: false,
        current_req_id: ''
    };

    handleRequestSubmit = (token) => {
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.props.postRequest(token, values.title, values.content)
                this.setState({ drawerVisible: false })
            }
        })
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

    handleCommentSubmit = (token, req_id, content) => {

        if (!this.state.commentValue) {
            return;
        }
        this.setState({
            commentSubmitting: true,
        });

        setTimeout(() => {
            this.setState({
                commentValue: '',
                commentSubmitting: false
            });
            this.props.postRequestComment(token, req_id, content)
        }, 100);
    };


    render() {
        const { loginStatus, token, userInfo, allRequests } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { commentSubmitting, commentValue } = this.state;

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
                                disabled={!loginStatus}
                                className="addRequest"
                                onClick={ () => { this.setState({ drawerVisible: true }) } }>
                            Add a new request
                        </Button>
                    </div>
                    <Row gutter={16}>
                        {   
                            allRequests !== null && allRequests.size > 0 ?
                            allRequests.map((item, index) => {
                                let comments = item.get("comments")
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
                                                extra={
                                                    loginStatus && item.get("user_name") === userInfo.get("username") ? 
                                                        <div className="deleteRequest"
                                                            onClick={() => this.confirmDeleteRequest(token, item.get("req_id"))}>
                                                            <Tooltip title={"Delete"}>
                                                                <Icon type="delete"  style={{ fontSize: '20px', color: "#1890ff", cursor: "pointer" }}/>
                                                            </Tooltip>
                                                        </div> : null
                                                    }>
                                                {item.get("request_content")}
                                                <div style={{margin: "20px 0"}}>
                                                    <span style={{color: "black"}}>{`Posted by ${item.get("user_name")} at `}</span>
                                                    <span style={{color: "#d48806", cursor: "pointer"}}>
                                                        <Tooltip title={item.get("request_time")}>
                                                            {moment(item.get("request_time")).fromNow()}
                                                        </Tooltip>
                                                    </span>
                                                    <span style={{float: "right"}} onClick={() => {this.setState({current_req_id: item.get("req_id")})}}>
                                                        <Tooltip title={"Comment"}>
                                                            <Icon type="message" style={{fontSize: '18px', color: "#1890ff", cursor: "pointer"}}/>
                                                        </Tooltip>
                                                    </span>
                                                </div>
                                                {/* show comments */}
                                                <div>
                                                    {
                                                        comments.size > 0 && 
                                                        <List
                                                            itemLayout="horizontal"
                                                            header={`${comments.size} ${comments.size > 1 ? 'replies' : 'reply'}`}
                                                            dataSource={comments}
                                                            renderItem={item => (
                                                                <Comment style={{backgroundColor: "#f5f5f5", marginBottom: 10}}
                                                                    actions={[
                                                                            loginStatus && item.get("commenter_id") === userInfo.get("id") ?
                                                                            <span key="delete" onClick={() => this.props.deleteRequestComment(token, item.get("id"))}>Delete</span>
                                                                            : null
                                                                        ]}
                                                                    author={item.get("commenter_name")}
                                                                    avatar={<Avatar src={item.get("commenter_avatar")} />}
                                                                    content={<p>{item.get("comment_content")}</p>}
                                                                    datetime={<Tooltip title={item.get("comment_time")}>
                                                                                {moment(item.get("comment_time")).fromNow()}
                                                                            </Tooltip>}
                                                                />
                                                            )}
                                                        />
                                                    
                                                    }
                                                    <Comment style={{display: (this.state.current_req_id === item.get("req_id")) ? 'block' : 'none'}}
                                                        avatar={ <Avatar src={loginStatus && userInfo.get("avatar") ? userInfo.get("avatar") : null} alt="L"/> }
                                                        content={
                                                            <Form >
                                                                <Form.Item>
                                                                    <TextArea rows={3}
                                                                            onChange={e => { this.setState({commentValue: e.target.value}) }} 
                                                                            value={commentValue}/>
                                                                </Form.Item>
                                                                <Form.Item>
                                                                    <Button type="primary" 
                                                                            disabled={!loginStatus}
                                                                            loading={commentSubmitting} 
                                                                            onClick={() => this.handleCommentSubmit(token, item.get("req_id"), commentValue)}>
                                                                        Add Comment
                                                                    </Button>
                                                                </Form.Item>
                                                            </Form>
                                                        }
                                                    />
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
                        <Button onClick={() => { this.handleRequestSubmit(token)} } type="primary">Submit</Button>
                    </div>
                </Drawer>
            </div>
        );
    }


    UNSAFE_componentWillMount(){
        if (cookie.load('userInfo')){
            this.props.isLogin(cookie.load('userInfo'))
        }
        this.props.getRequests()
    }
}

const mapState = (state) => {
	return {
        loginStatus: state.getIn(["combo", "loginStatus"]),
        token: state.getIn(["combo", "token"]),
        userInfo: state.getIn(["combo", "userInfo"]),
        allRequests: state.getIn(["combo", "allRequests"])
	}
}

const mapDispatch = (dispatch) => ({
    isLogin(token){
        dispatch(actionCreators.isLogin(token))
    },
    getRequests() {
        dispatch(actionCreators.getRequests())
    },
    postRequest(token, title, content) {
        dispatch(actionCreators.postRequest(token, title, content))
    },
    deleteRequest(token, req_id) {
        dispatch(actionCreators.deleteRequest(token, req_id))
    },
    postRequestComment(token, req_id, content) {
        dispatch(actionCreators.postRequestComment(token, req_id, content))
    },
    deleteRequestComment(token, comment_id){
        dispatch(actionCreators.deleteRequestComment(token, comment_id))
    }
});


export default connect(mapState, mapDispatch)(Form.create()(Request));
