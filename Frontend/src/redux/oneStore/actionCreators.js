import axios from 'axios';
import { fromJS } from 'immutable';
import {message} from 'antd';
import * as constants from './constants';
import * as helpers from '../../utils/helpers';



const baseURL = helpers.BACKEND_URL;
const getConfig = {
	headers: { "accept": "application/json" }
};
const postConfig = {
	headers: {
		"accept": "application/json",
		'Content-Type':'application/json',
	}
};


const userLogout = () => ({
	type: constants.LOGOUT,
	loginStatus: false
});

export const logout = () => {
	localStorage.removeItem('linkToken')
	return (dispatch) => {
		dispatch(userLogout());
	}
};

// login and get user data
const getUserData = (data, token) => ({
	type: constants.GET_USER_DATA,
	loginStatus: true,
	userInfo: fromJS(data),
	token: fromJS(token)
});

const loginSuccess = () => {
	message.success('Login Success');
};

const loginFailure = () => {
	message.error('Login Failure');
};

export const login = (username, password) => {
	const loginURL = baseURL + '/auth/login';
	const loginData = {"username": username, "password": password}
	return (dispatch) => {
		
		// login auth post
		axios.post(loginURL, loginData, postConfig).then((res) => {
			loginSuccess();
			console.log(res.data.token)
			localStorage.setItem('linkToken', res.data.token)
			// get user info
			const userURL = baseURL + '/user/';
			const AxiosConfig = {
				headers: {
					"accept": "application/json",
					"Authorization": res.data.token
				}
			};
			axios.get(userURL, AxiosConfig).then((response) => {
				const userData = response.data;
				dispatch(getUserData(userData, res.data.token));
			}).catch(() => {
				console.log("Get UserInfo Failure!");
			});
		}).catch(() => {
			loginFailure();
		});
	}
};

export const isLogin = (token) => {
	return (dispatch) => {
		// get user info
		const userURL = baseURL + '/user/';
		const AxiosConfig = {
			headers: {
				"accept": "application/json",
				"Authorization": token
			}
		};
		axios.get(userURL, AxiosConfig).then((response) => {
			const userData = response.data;
			dispatch(getUserData(userData, token));
		}).catch(() => {
			console.log("Get UserInfo Failure!");
		});
	}
};

// get home info
const getHomeProp = (data) => ({
	type: constants.HOME_PROP_INFO,
	homePropInfo: fromJS(data),

});

export const getHomeInfo = () => {
	const URL = baseURL + '/home/';
	return (dispatch) => {
		axios.get(URL, getConfig).then((res) => {
			dispatch(getHomeProp(res.data));
		}).catch(() => {
			console.log('Get home property data failure');
		})
	}
};

// get search results
const searchRes = (data) => ({
	type: constants.SEARCH_RES,
	searchResults: fromJS(data),
});

export const search = (location, house_type, start_date, end_date) => {
	const URL = baseURL + '/search?location=' + location
				+ '&house_type=' + house_type + '&start_date=' + start_date + '&end_date=' + end_date;
	return (dispatch) => {
		axios.get(URL, getConfig).then((res) => {
			dispatch(searchRes(res.data));
		}).catch(() => {
			console.log('Search Failure');
		})
	}
};

// get property detail
const getDetailProp = (data) => ({
	type: constants.GET_PROP_DETAIL,
	propDetail: fromJS(data),
});

export const getPropDetail = (property_id) => {
	const URL = baseURL + '/host/?property_id=' + property_id;
	return (dispatch) => {
		axios.get(URL, getConfig).then((res) => {
			console.log(res)
			dispatch(getDetailProp(res.data));
		}).catch(() => {
			console.log('Get Property Detail Failure');
		})
	}
};

const orderSuccess = () => {
	message.success('Order Success');
};

const orderFailure = () => {
	message.error('Order Failure');
};

// post order
export const comfirmOrder = (token, user_id, property_id, order_time, checkIn, checkOut, guests) => {
	const URL = baseURL + '/order/';
	const orderInfo = {
		"user_id": user_id, "property_id": property_id, "order_time": order_time,
		"checkIn": checkIn, "checkOut": checkOut, "guests": guests }
	const axiosConfig = {
		headers: {
			"accept": "application/json",
			"Authorization": token
		}
	};
	return (dispatch) => {
		axios.post(URL, orderInfo, axiosConfig).then((res) => {
			orderSuccess();
		}).catch(() => {
			orderFailure();
			console.log('Post Order Failure');
		})
	}
};



