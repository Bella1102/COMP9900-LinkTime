import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import { Form, DatePicker, Cascader, Button, Select, message} from 'antd';
// import { actionCreators } from './store';
import { actionCreators as homeActionCreators } from '../../pages/Home/store';
import './index.less';


const { Option } = Select;
const { RangePicker } = DatePicker;
const baseURL = 'http://127.0.0.1:5000';


class Search extends Component {

    state = {
        homePropInfo: null
    };

    locationTips = () => {
        message.error('Please select a location!');
    };

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if(!err){
                if (values.type === undefined) {
                    var house_type = '';
                } else {
                    house_type = values.type;
                }
                if (values.time === '' || values.time[0] === undefined) {
                    var start_date = '';
                    var end_date = '';
                } else {
                    start_date = values.time[0].format('YYYY-MM-DD');
                    end_date = values.time[1].format('YYYY-MM-DD');
                }
                if (values.location === '' || values.location === undefined ) {
                    var location = '';
                } else {
                    location = values.location[1];
                }
                this.props.search(location, house_type, start_date, end_date)
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const typeOptions = ['Apartment', 'Studio', 'House', 'Unit']
        let locationOptions = []
        if (this.state.homePropInfo !== null){
            let states = this.state.homePropInfo[0].state
            for (let key in states){
                let suburb = []
                states[key].map((val) => {
                    suburb.push({value: val, label: val})
                    return null
                })
                locationOptions.push({value: key, label: key, children: suburb })
            }
        }

        return (
            <div className="content">
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
            </div>
          );
    }

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
        loginStatus: state.getIn(["login", "loginStatus"]),
        searchResults: state.getIn(["home", "searchResults"]),
	}
}

const mapDispatch = (dispatch) => ({
    search(location, house_type, start_date, end_date) {
		dispatch(homeActionCreators.search(location, house_type, start_date, end_date))
	}
    
});


export default connect(mapState, mapDispatch)(Form.create()(Search));




