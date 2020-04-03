import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';


class FourOFour extends Component {

    render() {
        return (
            <Result style={{minHeight: 660}}
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Link to="/"><Button type="primary">Back Home</Button></Link>}
            />
        );
    }
}


export default FourOFour;