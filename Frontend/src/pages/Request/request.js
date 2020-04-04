import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Card, Drawer} from 'antd';
import { actionCreators } from '../../redux/oneStore';
import './request.less';



class Request extends Component {

    state = {
        visible: false
    };

    showDrawer = () => {
        this.setState({
          visible: true,
        });
    };

    onClose = () => { 
        this.setState({ 
            visible: false 
        })
    };

    render() {
        const { token, allRequests } = this.props;

        return (
            <div className="content">
                <div className="requestTitle">
                    Visitor Requests
                </div>
                <div style={{ background: '#ECECEC', padding: '20px' }}>
                    <Button icon="plus" 
                            type="primary" 
                            className="addRequest" 
                            onClick={this.showDrawer}>
                        Add a new request
                    </Button>
                    <Row gutter={16}>
                        {/* {   
                            allRequests !== null ?
                            allRequests.map((item, index) => {
                                return (
                                    <Col span={12} key={index} className="allRequests">
                                        
                                    </Col>
                                )
                            }) : null
                        } */}
                        <Col span={12} style={{marginBottom: 15}} >
                            <Card title="Card title" 
                                  extra={<a href="#">More</a>}>
                            Card content
                            </Card>
                        </Col>
                        <Col span={12} style={{marginBottom: 15}}>
                            <Card title="Card title">
                            Card content
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Card title" bordered={false}>
                            Card content
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Card title" bordered={false}>
                            Card content
                            </Card>
                        </Col>
                    </Row>
                </div>
                <Drawer
                    title="Post Request"
                    width={520}
                    headerStyle={{height: 58}}
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}>

                    <div className="drawerTextArea">
                        <Button style={{ marginRight: 8 }} onClick={this.onClose}>Cancel</Button>
                        <Button onClick={this.onClose} type="primary">Submit</Button>
                    </div>
            </Drawer>
        </div>
        );
    }


    UNSAFE_componentWillMount(){

    }
}

const mapState = (state) => {
	return {
        token: state.getIn(["combo", "token"]),
        allRequests: state.getIn(["combo", "allRequests"])
	}
}

const mapDispatch = (dispatch) => ({
    
});


export default connect(mapState, mapDispatch)(Request);

