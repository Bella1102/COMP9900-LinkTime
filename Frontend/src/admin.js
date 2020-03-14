import React, { Component, Fragment } from 'react';
import { Row, Col } from 'antd';
import Header from './common/Header';
import Footer from './common/Footer';
import './style/common.less'


 

class Admin extends Component {

    render() {
        return (
            <Fragment>
                <Row>
                    <Col span={24}>
                        <Header />
                        <Row>{ this.props.children }</Row>
                        <Footer />
                    </Col>
                </Row>
            </Fragment>
          );
    }
}

export default Admin;