import { combineReducers } from 'redux-immutable';
import { reducer as loginReducer } from '../pages/Form/store';

const reducer = combineReducers({
	login: loginReducer
});

export default reducer;