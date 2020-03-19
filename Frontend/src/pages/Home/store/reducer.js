import { fromJS } from 'immutable';
import * as constants from './constants';


const defaultState = fromJS({
	allPropInfo: null
});

export default (state = defaultState, action) => {
	switch(action.type) {
		case constants.ALL_PROP_INFO:
			return state.set('allPropInfo', action.allPropInfo);
		default:
			return state;
	}
};