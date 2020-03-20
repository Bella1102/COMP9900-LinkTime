import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './index.less';



class MyProp extends Component {

    state = {
        
    };

    render() {
        const para = "propdetail";
        return (
            <div style={{minHeight: 660, textAlign: "center", marginTop: 10}}>
                <Link to={`/prop/${para}`}>my properties</Link>
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


export default connect(mapState, mapDispatch)(MyProp);

