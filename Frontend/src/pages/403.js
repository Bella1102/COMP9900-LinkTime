import React, { Component } from 'react';
import { Result, Button } from 'antd';


class FourOThree extends Component {

    render() {
        return (
            <Result style={{minHeight: 660}}
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={<Button type="primary">Back Home</Button>}
            />
        );
    }
}


export default FourOThree;