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
		case constants.LOGOUT:
			return state.set('loginStatus', action.loginStatus);
		case constants.SEARCH_RES:
			return state.set('searchResults', action.searchResults);

		default:
			return state;
	}
};