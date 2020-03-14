import { fromJS } from 'immutable';
import * as constants from './constants';


const defaultState = fromJS({

});

export default (state = defaultState, action) => {
	switch(action.type) {
		// case constants.SEARCH_FOCUS:
		// 	return state.set('focused', true);
		default:
			return state;
	}
};