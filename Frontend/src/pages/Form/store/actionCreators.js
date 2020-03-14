import axios from 'axios';
import { fromJS } from 'immutable';
import * as constants from './constants';


const baseURL = '127.0.0.0:5000';


export const logout = () => ({
	type: constants.LOGOUT,
	loginStatus: false
});


const getUserData = (data, token) => ({
	type: constants.GET_USER_DATA,
	loginStatus: true,
	userInfo: fromJS(data),
	token: fromJS(token)
});

export const login = (account, password) => {
	const loginURL = baseURL + '/auth/login';
	const loginAxiosConfig = {
		headers: {
			"accept": "application/json",
			'Content-Type':'application/json'
		}
	};
	const loginData = {"username": account, "password": password}
	return (dispatch) => {
		// login auth post
		axios.post(loginURL, loginData, loginAxiosConfig).then((res) => {
			
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
			console.log("Login Failure!");
		});
	}
};
