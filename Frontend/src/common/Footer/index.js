import React, { Component } from 'react';
import { BackTop } from 'antd';
import './index.less';



class Footer extends Component {

    render() {
        return (
            <div className="footer">
                Copyright © COMP9900
                <BackTop />
            </div>
          );
    }
}

export default Footer;