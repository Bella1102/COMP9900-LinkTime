import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './index.less';



class PropDetail extends Component {

    render() {
        return (
            <div style={{minHeight: 660, textAlign: "center", marginTop: 10}}>
                property details
            </div>
          );
    }
}

const mapState = (state) => {
	return {
		loginStatus: state.getIn(["login", "loginStatus"])
	}
}

const mapDispatch = (dispatch) => ({
    
});


export default connect(mapState, mapDispatch)(PropDetail);