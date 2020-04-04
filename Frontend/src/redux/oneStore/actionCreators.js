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
const axiosConfig = (token) => {
	return {
		headers: {
			"accept": "application/json",
			"Authorization": token
		}
	}
};
const axiosPostConfig = (token) => {
	return {
		headers: {
			"accept": "application/json",
			'Content-Type':'application/json',
			"Authorization": token
		}
	}
};

// user logout
const userLogout = () => ({
	type: constants.LOGOUT,
	loginStatus: false,
	userInfo: null,
	token: null
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
	allProps: fromJS(data.properties),
	token: fromJS(token)
});

const loginSuccess = () => {
	message.success('Login Success');
};

const loginFailure = (err) => {
	message.error('Login Failure: ' + err);
};

export const getUserInfo = (token) => {
	const userURL = baseURL + '/user/';
	return (dispatch) => {
		axios.get(userURL, axiosConfig(token)).then((response) => {
			console.log(response)
			const userData = response.data;
			dispatch(getUserData(userData, token));
		}).catch((error) => {
			console.log(error.response.data.message);
		});
	}
}

export const isLogin = (token) => {
	return (dispatch) => {
		// get user info
		dispatch(getUserInfo(token))
	}
};

export const login = (username, password) => {
	const loginURL = baseURL + '/auth/login';
	const loginData = {"username": username, "password": password}
	return (dispatch) => {
		
		// login auth post
		axios.post(loginURL, loginData, postConfig).then((res) => {
			loginSuccess();
			localStorage.setItem('linkToken', res.data.token)
			// get user info
			dispatch(getUserInfo(res.data.token))
		}).catch((error) => {
			loginFailure(error.response.data.message);
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
			dispatch(getDetailProp(res.data));
		}).catch(() => {
			console.log('Get Property Detail Failure');
		})
	}
};

const orderSuccess = () => {
	message.success('Order Success');
};

const orderFailure = (err) => {
	message.error('Order Failure: ' + err);
};

// post order
export const comfirmOrder = (token, property_id, checkIn, checkOut, guests) => {
	const URL = baseURL + '/order/';
	const orderInfo = { "property_id": property_id, "checkIn": checkIn, "checkOut": checkOut, "guests": guests }

	return (dispatch) => {
		axios.post(URL, orderInfo, axiosConfig(token)).then((res) => {
			orderSuccess();
			console.log(res)
		}).catch((error) => {
			orderFailure(error.response.data.message);
		})
	}
};

// get user orders
const getOrders = (data) => ({
	type: constants.GET_ORDERS,
	allOrders: fromJS(data),
});

export const getMyOrders = (token) => {
	const URL = baseURL + '/order/';
	return (dispatch) => {
		axios.get(URL, axiosConfig(token)).then((res) => {
			dispatch(getOrders(res.data));
			console.log(res.data)
		}).catch(() => {
			console.log('Get User Orders Failure');
		})
	}
};

const deleteSuccess = () => {
	message.success('Cancel Order Success');
};

const deleteFailure = (err) => {
	message.error('Cancel Order Failure: ' + err);
};

// delete order
export const deleteOrder = (token, order_id) => {
	const URL = baseURL + '/order/?order_id=' + order_id;
	return (dispatch) => {
		axios.delete(URL, axiosConfig(token)).then((res) => {
			deleteSuccess();
			console.log(res)
			// after delete, reget user orders
			dispatch(getMyOrders(token))
		}).catch((error) => {
			deleteFailure(error.response);
		})
	}
};


const deletePropSuccess = () => {
	message.success('Delete Property Success');
};

const deletePropFailure = (err) => {
	message.error('Delete Property Failure: ' + err);
};

// delete property
export const deleteProperty = (token, property_id) => {
	const URL = baseURL + '/order/?order_id=' + property_id;
	return (dispatch) => {
		axios.delete(URL, axiosConfig(token)).then((res) => {
			deletePropSuccess();
			// after delete, reget user properties
			
		}).catch((error) => {
			deletePropFailure(error.response.data.message);
		})
	}
};


const updatePropSuccess = () => {
	message.success('Update Property Success');
};

const updatePropFailure = (err) => {
	message.error('Update Property Failure: ' + err);
};

// update property
export const updateProperty = (token, property_id) => {
	const URL = baseURL + '/order/?order_id=' + property_id;
	// const orderInfo = { "property_id": property_id }

	return (dispatch) => {
		axios.delete(URL, axiosConfig(token)).then((res) => {
			updatePropSuccess();
			// after update, reget user properties
			
		}).catch((error) => {
			updatePropFailure(error.response.data.message);
		})
	}
};


const commentSuccess = () => {
	message.success('Comment Success');
};

const commentFailure = (err) => {
	message.error('Comment Failure: ' + err);
};

// post review
export const submitComment = (token, property_id, order_id, title, content) => {
	const URL = baseURL + '/review/';
	const data = { "property_id": property_id, "order_id": order_id, "title": title, "content": content }

	return (dispatch) => {
		axios.post(URL,  data, axiosPostConfig(token)).then((res) => {
			commentSuccess();
			console.log(res)
		}).catch((error) => {
			commentFailure(error.response.data.message);
		})
	}
};



