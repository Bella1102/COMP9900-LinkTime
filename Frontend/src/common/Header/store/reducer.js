import { fromJS } from 'immutable';
import * as constants from './constants';


const defaultState = fromJS({
	focused: false,
	mouseIn: false,
	list: [],
	page: 1,
	totalPage: 1
});

export default (state = defaultState, action) => {
	switch(action.type) {
		case constants.SEARCH_FOCUS:
			return state.set('focused', true);
		default:
			return state;
	}
};