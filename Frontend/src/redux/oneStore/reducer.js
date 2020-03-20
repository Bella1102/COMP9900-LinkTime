import { fromJS } from 'immutable';
import * as constants from './constants';


const defaultState = fromJS({
	loginStatus: false,
	userInfo: null,
	token: '',
	searchResults: null
});

export default (state = defaultState, action) => {
	switch(action.type) {
		case constants.GET_USER_DATA:
			return state.merge({
				loginStatus: action.loginStatus,
				userInfo: action.userInfo,
				token: action.token
			});
		// immutable对象的set方法，会结合之前immutable对象的值和设置的值，返回一个全新的值
		case constants.LOGOUT:
			// return { loginStatus: action.loginStatus };
			return state.set('loginStatus', action.loginStatus);
		case constants.SEARCH_RES:
			return state.set('searchResults', action.searchResults);

		default:
			return state;
	}
};