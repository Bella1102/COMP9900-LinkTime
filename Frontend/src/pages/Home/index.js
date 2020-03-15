import React, { Component } from 'react';
import { connect } from 'react-redux';
import NotLoginHome from './beforeLogin'
import LoginHome from './afterLogin'



class Home extends Component {

	render() {
		const { loginStatus } = this.props;
		if (!loginStatus) {
			return (
				<NotLoginHome />
			)
		} else {
			return(
				<LoginHome />
			)
		}
	}
}

const mapState = (state) => {
	return {
		loginStatus: state.getIn(["login", "loginStatus"]),
		userInfo: state.getIn(["login", "userInfo"])
	}
};

export default connect(mapState, null)(Home);