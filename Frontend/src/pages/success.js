import React, { Component } from 'react';
import { Result, Button } from 'antd';


class Success extends Component {

    render() {
        return (
            <Result style={{minHeight: 660}}
                status="success"
                title="Successfully Purchased the Reservation!"
                subTitle="Order configuration takes 1-5 minutes, please wait."
                extra={[
                    <Button type="primary">Go Home Page</Button>,
                    <Button type="primary">Go Order Page</Button>
                ]}
            />
        );
    }
}


export default Success;

