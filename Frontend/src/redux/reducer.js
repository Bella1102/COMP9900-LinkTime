// import { combineReducers } from 'redux';
import { combineReducers } from 'redux-immutable';
import { reducer as comboReducer } from './oneStore';

const reducer = combineReducers({
	combo: comboReducer
});

export default reducer;