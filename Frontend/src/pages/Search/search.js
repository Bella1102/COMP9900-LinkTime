import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Cascader, DatePicker, Button } from 'antd';
import './index.less';


const options1 = [ {value: "Apartment", label: "Apartment"}, 
                   {value: "Studio", label: "Studio"}, 
                   {value: "Unit", label: "Unit"}, 
                   {value: "House", label: "House"} ]

const options2 = [
    {
      value: 'zhejiang', label: 'Zhejiang',
      children: [{ value: 'jiangsu', label: 'Jiangsu'}],
    }, {
        value: 'jiangsu', label: 'Jiangsu',
        children: [{ value: 'nanjing', label: 'Nanjing'}]
      }
];


class Search extends Component {

    render() {
        const { RangePicker } = DatePicker;

        return (
            <div>
               <div className="searchModule">
                    <Cascader className="searchInner"
                              options={options1} 
                              onChange={this.onChange} 
                              placeholder="House type" />
                    <Cascader className="searchInner"
                              options={options2} 
                              onChange={this.onChange} 
                              placeholder="Select location" />
                    <RangePicker className="searchInner" 
                                 onChange={this.onChange} />
                    <Link to='/search'>
                        <Button type="primary" 
                                onClick={() => {}} 
                                style={{width:100}}>Search</Button>
                    </Link>
                </div>

            </div>
          );
    }
}



const mapState = (state) => {
	return {
		
	}
};

const mapDispath = (dispatch) => {
	return {

	}
};


export default connect(mapState, mapDispath)(Search);