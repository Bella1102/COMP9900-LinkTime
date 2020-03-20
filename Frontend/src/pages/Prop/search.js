import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import { Form, DatePicker, Cascader, Button, Select } from 'antd';
import { actionCreators } from '../../redux/oneStore';
import * as helpers from '../../utils/helpers';
// import SimpleMap from './map';
import './index.less';


const { Option } = Select;
const { RangePicker } = DatePicker;
const baseURL = helpers.BACKEND_URL;


class Search extends Component {

    state = {
        homePropInfo: null
    };

    // same as home page1: both need to submit search form
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if(!err){
                let location, house_type, start_date, end_date;
                [location, house_type, start_date, end_date] = helpers.searchSubmit(values)
                this.props.search(location, house_type, start_date, end_date)
            }
        })
    }

    render() {

        const { homePropInfo } = this.state;
        const { getFieldDecorator } = this.props.form;

        const typeOptions = ['Apartment', 'Studio', 'House', 'Unit']
        // same as home page2: same locationOptions
        let locationOptions = []
        if (homePropInfo !== null){
            locationOptions =  helpers.getLocationOptions(homePropInfo)
        }

        return (
            <div className="content">
                {/* same as home page3: same search from  */}
                <Form layout="inline" className="searchModule">
                    <Form.Item>
                        {
                            getFieldDecorator('location', {
                                initialValue: '',
                                rules: []
                            })(<Cascader className="searchInner" options={locationOptions} placeholder="Select location" />)
                        }
                    </Form.Item>
                    <Form.Item>
                        {
                            getFieldDecorator('type', {
                                initialValue: undefined,
                                rules: []
                            })(<Select allowClear style={{width: 205}} placeholder="Select type">
                                    {
                                        typeOptions.map(item => (
                                            <Option key={item} value={item}>{item}</Option>
                                        ))
                                    }
                                </Select>)
                        }
                    </Form.Item>
                    <Form.Item>
                        {
                            getFieldDecorator('time', {
                                initialValue: ''
                            }) ( <RangePicker ranges={{ Today: [moment(), moment()], 
                                            'This Month': [moment().startOf('month'), moment().endOf('month')]}}/>)
                        }
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" style={{width: 100}} onClick={this.handleSubmit}> Search</Button>
                    </Form.Item>
                </Form>

                {/* <SimpleMap/> */}
            </div>
          );
    }

    // same as home page4: only for location form use 
    UNSAFE_componentWillMount(){
        const URL = baseURL + '/home/';
        const config = { headers: { "accept": "application/json" } };
        axios.get(URL, config).then((res) => {
            this.setState({
				homePropInfo: res.data
			})
        }).catch(() => {
            console.log('Get home property data failure');
        })
        
    }
}



const mapState = (state) => {
	return {
        loginStatus: state.getIn(["combo", "loginStatus"]),
        searchResults: state.getIn(["combo", "searchResults"]),
	}
}

const mapDispatch = (dispatch) => ({
    search(location, house_type, start_date, end_date) {
		dispatch(actionCreators.search(location, house_type, start_date, end_date))
	}
    
});


export default connect(mapState, mapDispatch)(Form.create()(Search));







