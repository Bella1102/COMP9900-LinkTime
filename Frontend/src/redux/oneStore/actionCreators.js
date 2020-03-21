import axios from 'axios';
import { fromJS } from 'immutable';
import {message} from 'antd';
import * as constants from './constants';
import * as helpers from '../../utils/helpers';


const baseURL = helpers.BACKEND_URL;


export const logout = () => ({
	type: constants.LOGOUT,
	loginStatus: false
});

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
	const loginAxiosConfig = {
		headers: {
			"accept": "application/json",
			'Content-Type':'application/json'
		}
	};
	const loginData = {"username": username, "password": password}
	return (dispatch) => {
		// login auth post
		axios.post(loginURL, loginData, loginAxiosConfig).then((res) => {
			loginSuccess()
			// get user info
			const userURL = baseURL + '/user/';
			const AxiosConfig = {
				headers: {
					"accept": "application/json",
					"Authorization": res.data.token
				}
			};
			axios.get(userURL, AxiosConfig).then((response) => {
				console.log(response)
				const userData = response.data;
				dispatch(getUserData(userData, res.data.token));
			}).catch(() => {
				console.log("Get UserInfo Failure!");
			});

		}).catch(() => {
			loginFailure()
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
	const config = { headers: { "accept": "application/json" } };
	return (dispatch) => {
		axios.get(URL, config).then((res) => {
			console.log(res)
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
	const config = {
		headers: { "accept": "application/json" }
	};
	return (dispatch) => {
		axios.get(URL, config).then((res) => {
			console.log(res)
			dispatch(searchRes(res.data));
		}).catch(() => {
			console.log('Search Failure');
		})
	}
};


