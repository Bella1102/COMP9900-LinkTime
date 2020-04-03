import { fromJS } from 'immutable';
import * as constants from './constants';


const defaultState = fromJS({
	loginStatus: false,
	userInfo: null,
	token: null,
	homePropInfo: null,
	searchResults: null,
	propDetail: null
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
			return state.merge({
				loginStatus: action.loginStatus,
				userInfo: action.userInfo,
				token: action.token
			});
		case constants.HOME_PROP_INFO:
			return state.set('homePropInfo', action.homePropInfo);
		case constants.SEARCH_RES:
			return state.set('searchResults', action.searchResults);
		case constants.GET_PROP_DETAIL:
			return state.set('propDetail', action.propDetail);

		default:
			return state;
	}
};