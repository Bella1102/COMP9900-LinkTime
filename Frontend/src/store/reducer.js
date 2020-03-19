import { combineReducers } from 'redux-immutable';
import { reducer as loginReducer } from '../pages/Form/store';
import { reducer as homeReducer } from '../pages/Home/store';

const reducer = combineReducers({
	login: loginReducer,
	home: homeReducer
});

export default reducer;