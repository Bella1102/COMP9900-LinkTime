import { fromJS } from 'immutable';
import * as constants from './constants';


const defaultState = fromJS({
	loginStatus: false,
	userInfo: null,
	allProps: null,
	token: null,
	homePropInfo: null,
	searchResults: [],
	filterResults: [],
	propDetail: null,
	allOrders: null,
	allRequests: null
});

export default (state = defaultState, action) => {
	switch(action.type) {
		case constants.GET_USER_DATA:
			return state.merge({
				loginStatus: action.loginStatus,
				userInfo: action.userInfo,
				allProps: action.allProps,
				token: action.token
			});
		// immutable对象的set方法，会结合之前immutable对象的值和设置的值，返回一个全新的值
		case constants.LOGOUT:
			return state.merge({
				loginStatus: action.loginStatus,
				userInfo: action.userInfo,
				token: action.token
			});
		case constants.HOME_PROP_INFO:
			return state.set('homePropInfo', action.homePropInfo);
		case constants.SEARCH_RES:
			return state.set('searchResults', action.searchResults);
		case constants.FILTER:
			return state.set('filterResults', action.filterResults);
		case constants.GET_PROP_DETAIL:
			return state.set('propDetail', action.propDetail);
		case constants.GET_ORDERS:
			return state.set('allOrders', action.allOrders);
		case constants.GET_REQUESTS:
			return state.set('allRequests', action.allRequests);
		default:
			return state;
	}
};




