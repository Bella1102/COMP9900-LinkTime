import axios from 'axios';
import { fromJS } from 'immutable';
import * as constants from './constants';


const baseURL = 'http://127.0.0.1:5000';


const searchRes = (data) => ({
	type: constants.SEARCH_RES,
	searchResults: fromJS(data),
});


export const search = (location, house_type, start_date, end_date) => {
	const URL = baseURL + '/search?location=' + location
				+ '&house_type=' + house_type + '&start_date=' + start_date + '&end_date=' + end_date;
	const config = {
		headers: { "accept": "application/json" }
	};
	return (dispatch) => {
		axios.get(URL, config).then((res) => {
			console.log(res)
			dispatch(searchRes(res.data));
		}).catch(() => {
			console.log('Search Failure');
		})
	}
};
