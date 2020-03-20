import React, { Component } from 'react';
import { connect } from 'react-redux';
import './index.less';



class Request extends Component {

    render() {
        return (
            <div style={{minHeight: 660, textAlign: "center", marginTop: 10}}>
                all requests
            </div>
          );
    }
}

const mapState = (state) => {
	return {
		loginStatus: state.getIn(["combo", "loginStatus"])
	}
}

const mapDispatch = (dispatch) => ({
    
});


export default connect(mapState, mapDispatch)(Request);

