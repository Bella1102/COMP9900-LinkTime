import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Col, Carousel, DatePicker, Cascader, Button } from 'antd';
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

        return (
            <div className="content" >

                <div className="contentUp">
                    <h1 className="book">Hi Link, Welcome to book your trip!</h1>
                    <div className="homeSearchModule">
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
                                    style={{width: 100}}>Search
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* 轮播图 */}
                <Carousel autoplay>
                    <div>
                        <img src="/carousel-img/1.jpg" alt=""/>
                    </div>
                    <div>
                        <img src="/carousel-img/2.jpg" alt="" />
                    </div>
                    <div>
                        <img src="/carousel-img/3.jpeg" alt="" />
                    </div>
                </Carousel>

                {/* space type */}
                <div className="spaceType">
                    <div>
                        <h2 className="spaceTitle">Find the type of space that you like</h2>
                    </div>
                    <Row className="typePics">
                        <Col span={6}>
                            <div className="imgCenter"><img src="/space-type/house.png" alt=""/></div>
                            <div className="allTypes">Houses</div>
                            <p className="moreCenter">explore more houses</p>
                        </Col>
                        <Col span={6}>
                            <div className="imgCenter"><img src="/space-type/apartment.png" alt=""/></div>
                            <div className="allTypes">Apartments</div>
                            <p className="moreCenter">explore more apartments</p>
                        </Col>
                        <Col span={6}>
                            <div className="imgCenter"><img src="/space-type/studio.png" alt=""/></div>
                            <div className="allTypes">Studios</div>
                            <p className="moreCenter">explore more studios</p>
                        </Col>
                        <Col span={6}>
                            <div className="imgCenter"><img src="/space-type/unit.png" alt=""/></div>
                            <div className="allTypes">Units</div>
                            <p className="moreCenter">explore more units</p>
                        </Col>
                    </Row>
                </div >

                {/* Recommend hotels */}
                <div className="recommendList">
                    <div>
                        <h2 className="listTitle">Top-rated experiences in Sydney</h2>
                    </div>
                    <Row>
                        <div className="oneRec">
                            <img src="/space-type/house.png" alt=""/>
                            <div className="allTypes">Beautiful separate private 1B suite</div>
                            <div>61 Marian Pl, Prospect SA 5082</div>
                            <div>$90 AUD/night</div>
                        </div>
                        <div className="oneRec">
                            <img src="/space-type/apartment.png" alt=""/>
                            <div className="allTypes">Beautiful separate private 1B suite</div>
                            <div>61 Marian Pl, Prospect SA 5082</div>
                            <div>$90 AUD/night</div>
                        </div>
                        <div className="oneRec">
                            <img src="/space-type/studio.png" alt=""/>
                            <div className="allTypes">Beautiful separate private 1B suite</div>
                            <div>61 Marian Pl, Prospect SA 5082</div>
                            <div>$90 AUD/night</div>
                        </div>
                        <div className="oneRec">
                            <img src="/space-type/unit.png" alt=""/>
                            <div className="allTypes">Beautiful separate private 1B suite</div>
                            <div>61 Marian Pl, Prospect SA 5082</div>
                            <div>$90 AUD/night</div>
                        </div>
                        <div className="lastRec">
                            <img src="/space-type/house.png" alt=""/>
                            <div className="allTypes">Beautiful separate private 1B suite</div>
                            <div>61 Marian Pl, Prospect SA 5082</div>
                            <div>$90 AUD/night</div>
                        </div>
                    </Row>
                </div>

             </div>
          );
    }
}

const mapState = (state) => {
	return {
		loginStatus: state.getIn(["login", "loginStatus"])
	}
}

const mapDispatch = (dispatch) => ({
    
});


export default connect(mapState, mapDispatch)(Home);