import React, { Component } from 'react';
import { Result, Button } from 'antd';


class FourOFour extends Component {

    render() {
        return (
            <Result style={{minHeight: 660}}
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary">Back Home</Button>}
            />
        );
    }
}


export default FourOFour;