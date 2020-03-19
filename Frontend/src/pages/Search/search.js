import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, DatePicker, Cascader, Button, Select} from 'antd';
import { actionCreators } from './store';
import './index.less';


const { Option } = Select;
const { RangePicker } = DatePicker;


class Search extends Component {


    render() {
        const { getFieldDecorator } = this.props.form;

        const typeOptions = ['Apartment', 'Loft', 'House', 'Unit']
        const locationOptions = [
            {
                value: 'jiangsu', label: 'Jiangsu',
                children: [{ value: 'nanjing', label: 'Nanjing'}]
            }
        ];

        return (
            <div className="content">
                <Form layout="inline" className="searchModule" onSubmit={this.handleSubmit}>
                <Form.Item>
                    {
                        getFieldDecorator('location', {
                            initialValue: '',
                            rules: [
                                { required: true, message: 'Please select location!'}
                            ]
                        })(<Cascader className="searchInner" options={locationOptions} placeholder="Select location" />)
                    }
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('type', {
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
                        })( <RangePicker format="YYYY-MM-DD"/>)
                    }
                </Form.Item>
                <Form.Item>
                    <Link to='/search'><Button type="primary" style={{width: 100}}> Search</Button></Link>
                </Form.Item>
            </Form>
        </div>
          );
    }
}



const mapState = (state) => {
	return {
        loginStatus: state.getIn(["login", "loginStatus"]),
        allPropInfo: state.getIn(["home", "allPropInfo"]),
	}
}

const mapDispatch = (dispatch) => ({
    
});


export default connect(mapState, mapDispatch)(Form.create()(Search));




