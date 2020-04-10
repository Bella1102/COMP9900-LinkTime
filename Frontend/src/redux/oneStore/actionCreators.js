import axios from 'axios';
import { fromJS } from 'immutable';
import cookie from 'react-cookies'
import {message} from 'antd';
import * as constants from './constants';
import * as helpers from '../../utils/helpers';


const baseURL = helpers.BACKEND_URL;
// const expires = new Date()
// expires.setDate(Date.now() + 1000 * 60 * 60 * 24 * 7)

const getConfig = {
	headers: { "accept": "application/json" }
};
export const postConfig = {
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
export const axiosPostConfig = (token) => {
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
	token: null
});

export const logout = () => {
	// ##############################
	localStorage.removeItem('linkToken')
	cookie.remove('userInfo', { path: '/' })
	return (dispatch) => {
		dispatch(userLogout());
	}
};

const loginSuccess = () => {
	message.success('Login Success');
};
const loginFailure = (err) => {
	message.error('Login Failure: ' + err);
};

// login and get user data
const getUserData = (data, token) => ({
	type: constants.GET_USER_DATA,
	loginStatus: true,
	userInfo: fromJS(data),
	allProps: fromJS(data.properties),
	token: fromJS(token)
});
export const getUserInfo = (token) => {
	const userURL = baseURL + '/user/';
	return (dispatch) => {
		axios.get(userURL, axiosConfig(token)).then((res) => {
			dispatch(getUserData(res.data, token));
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
			// ##############################
			localStorage.setItem('linkToken', res.data.token)
			cookie.save('userInfo', res.data.token, { path: '/', maxAge: 3600*24*7 })
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
			console.log('Get home data failure');
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

// get orders
const getOrders = (data) => ({
	type: constants.GET_ORDERS,
	allOrders: fromJS(data),
});
export const getMyOrders = (token) => {
	const URL = baseURL + '/order/';
	return (dispatch) => {
		axios.get(URL, axiosConfig(token)).then((res) => {
			dispatch(getOrders(res.data));
		}).catch((error) => {
			console.log(error.response.data.message);
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
			// after post, reget user orders
			dispatch(getMyOrders(token))
		}).catch((error) => {
			orderFailure(error.response.data.message);
		})
	}
};

const cancelOrderSuccess = () => {
	message.success('Cancel Order Success');
};
const cancelOrderFailure = (err) => {
	message.error('Cancel Order Failure: ' + err);
};
// cancel order
export const cancelOrder = (token, order_id) => {
	const URL = baseURL + '/order/?order_id=' + order_id;
	return (dispatch) => {
		axios.delete(URL, axiosConfig(token)).then((res) => {
			cancelOrderSuccess();
			// after delete, reget user orders
			dispatch(getMyOrders(token))
		}).catch((error) => {
			cancelOrderFailure(error.response.data.message);
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
export const submitComment = (token, property_id, content) => {
	const URL = baseURL + '/review/';
	const data = { "property_id": property_id, "review_content": content }
	return (dispatch) => {
		axios.post(URL, data, axiosPostConfig(token)).then((res) => {
			commentSuccess();
			console.log(res)
		}).catch((error) => {
			commentFailure(error.response.data.message);
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
	const URL = baseURL + '/host/?property_id=' + property_id;
	return (dispatch) => {
		axios.delete(URL, axiosConfig(token)).then((res) => {
			deletePropSuccess();
			// after delete, reget userInfo to get newest user properties
			dispatch(getUserInfo(token))
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
export const updateProperty = (token, property_id, propData) => {
	const URL = baseURL + '/host/?property_id=' + property_id;
	return (dispatch) => {
		axios.put(URL, propData, axiosPostConfig(token)).then((res) => {
			updatePropSuccess();
			// after update, reget userInfo to get newest user properties
			dispatch(getUserInfo(token))
		}).catch((error) => {
			updatePropFailure(error.response.data.message);
		})
	}
};

// get requests
const getAllRequests = (data) => ({
	type: constants.GET_REQUESTS,
	allRequests: fromJS(data),
});
export const getRequests = () => {
	const URL = baseURL + '/requests/';
	return (dispatch) => {
		axios.get(URL, getConfig).then((res) => {
			dispatch(getAllRequests(res.data));
		}).catch((error) => {
			console.log("get request failure");
		})
	}
};

const postRequestSuccess = () => {
	message.success('Post Request Success');
};
const postRequestFailure = (err) => {
	message.error('Post Request Failure: ' + err);
};
// post request
export const postRequest = (token, title, content) => {
	const URL = baseURL + '/requests/';
	const data = { "request_title": title, "request_content": content }
	return (dispatch) => {
		axios.post(URL, data, axiosPostConfig(token)).then((res) => {
			postRequestSuccess();
			dispatch(getRequests())
			console.log(res)
		}).catch((error) => {
			postRequestFailure(error.response.data.message);
		})
	}
};

const deleteRequestSuccess = () => {
	message.success('Delete Request Success');
};
const deleteRequestFailure = (err) => {
	message.error('Delete Request Failure: ' + err);
};
// delete request
export const deleteRequest = (token, req_id) => {
	const URL = baseURL + '/requests/?req_id=' + req_id;
	return (dispatch) => {
		axios.delete(URL, axiosConfig(token)).then((res) => {
			deleteRequestSuccess();
			dispatch(getRequests())
		}).catch((error) => {
			deleteRequestFailure(error.response.data.message);
		})
	}
};

// post request comment
export const postRequestComment = (token, req_id, content) => {
	const URL = baseURL + '/requests/comment?req_id=' + req_id;
	const data = { "comment_content": content }
	return (dispatch) => {
		axios.post(URL, data, axiosPostConfig(token)).then((res) => {
			dispatch(getRequests())
		}).catch((error) => {
			console.log(error.response.data.message);
		})
	}
};

// delete request comment
export const deleteRequestComment = (token, comment_id) => {
	const URL = baseURL + '/requests/comment?comment_id=' + comment_id;
	return (dispatch) => {
		axios.delete(URL, axiosConfig(token)).then((res) => {
			dispatch(getRequests())
		}).catch((error) => {
			console.log(error.response.data.message);
		})
	}
};


//############################################################
export const filterProperty = (temp) => ({
	type: constants.FILTER,
	filterResults: temp,
});

