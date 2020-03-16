import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './index.less';



class Property extends Component {

    render() {
        const para = "propdetail";
        return (
            <div style={{minHeight: 660, textAlign: "center", marginTop: 10}}>
                <Link to={`/property/${para}`}>my properties</Link>
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


export default connect(mapState, mapDispatch)(Property);