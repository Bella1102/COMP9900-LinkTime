import axios from 'axios';
import { fromJS } from 'immutable';
import * as constants from './constants';


const baseURL = 'http://127.0.0.1:5000';


const getAllProp = (data) => ({
	type: constants.ALL_PROP_INFO,
	allPropInfo: fromJS(data),
});


export const getAllPropInfo = () => {
	const URL = baseURL + '/home/';
	const config = {
		headers: { "accept": "application/json" }
	};
	return (dispatch) => {
		axios.get(URL, config).then((res) => {
			console.log(res)
			dispatch(getAllProp(res.data));
		}).catch(() => {
			console.log('no property data');
		})
	}
};
