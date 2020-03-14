import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Carousel, DatePicker, Cascader, Button } from 'antd';
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


class Home extends Component {
    

    onChange(date, dateString) {
        console.log(date, dateString);
    }

    render() {
        const { RangePicker } = DatePicker;

        // const formItemLayout = {
        //     labelCol: { md: 24, lg: 8 },
        //     wrapperCol: { md: 24, lg: 8 }
        // }

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
                                style={{width:100}}>Search
                        </Button>
                    </Link>
                </div>

                <Carousel autoplay>
                    <div>
                        <img src="/carousel-img/1.jpg" alt=""/>
                    </div>
                    <div>
                        <img src="/carousel-img/2.jpg" alt="" />
                    </div>
                    <div>
                        <img src="/carousel-img/3.jpg" alt="" />
                    </div>
                </Carousel>
             </div>
          );
    }
}

export default Home;