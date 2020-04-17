import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import cookie from 'react-cookies'
import moment from 'moment';
import { fromJS } from 'immutable';
import GoogleMapReact from 'google-map-react';
import { Form, DatePicker, Cascader, Button, Select, Row, Col, 
    Pagination, Icon, Tag, Popover, Checkbox, Radio, Slider, Empty} from 'antd';
import { actionCreators } from '../../redux/oneStore';
import * as helpers from '../../utils/helpers';
import './search.less';


const { Option } = Select;
const { RangePicker } = DatePicker;

function formatter(value) {
    return value;
}


class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            center: { lat: -33.86917, lng: 151.22656 },
            zoom: 15,
            target: -1,
            current: 1,
            pageSize: 10,
            bed_value: 0,
            bath_value: 0,
            guest_value: 0,
            feature_value: [],
            sortPrice_value: "Default",
            showWhichResult: "search"
        };
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
      }

    // same as home page1: both need to submit search form
    handleSubmit = () => {
        this.setState({  showWhichResult: "search" });
        this.props.form.validateFields((err, values) => {
            if(!err){
                let location, house_type, start_date, end_date;
                [location, house_type, start_date, end_date] = helpers.searchSubmit(values)
                this.props.search(location, house_type, start_date, end_date)
            }
        })
    }
    
    disabledDate = (current) => {
        // Can not select days before today
        return current && current < moment().add(-1, 'days');
    }

    handleMouseOver(index, latitude, longitude){
        let center = { lat: latitude, lng: longitude }
        this.setState({
            target: index,
            center
        }) 
    }

    handleMouseLeave(){
        this.setState({ target: -1 })
    }

    onShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSize: pageSize
        })
    }
    //############################################################
    handleBedNumChange = value => {
        console.log(value)
        this.setState({ bed_value: value });
    };

    handleBathNumChange = value => {
        console.log(value)
        this.setState({ bath_value: value });
    };

    handleGuestNumChange = value => {
        console.log(value)
        this.setState({ guest_value: value });
    };

    handleFilterFeature(value){
        console.log(value)
        this.setState({ feature_value: value });
    }

    handleSortPrice(value) {
        console.log(value)
        this.setState({ sortPrice_value: value });
    }
    //############################################################

    filterNum = (type, temp) => {
        let res;
        if (type === 'bedrooms'){
            res = temp.filter((item) => {
                let bed_num = item.get('bedrooms')
                if (this.state.bed_value <= bed_num){
                    return true
                }
                return false
            })
        }
        if (type === 'bathrooms'){
            res = temp.filter((item) => {
                let bath_num = item.get('bathrooms')
                if (this.state.bath_value <= bath_num){
                    return true
                }
                return false
            })
            
        }
        if (type === 'guests'){
            res = temp.filter((item) => {
                let guests_num = item.get('accommodates')
                if (this.state.guest_value <= guests_num){
                    return true
                }
                return false
            })
        }
        return res
    }

    filterFeature = (temp) => {
        let res = temp.filter((item) => {
            let amenities = new Set(item.get("amenities").slice(1, -1).split(','))
            let flag = true
            this.state.feature_value.map((a) => {
                if (amenities.has(a) === false){
                    flag = false
                }
                return flag
            })
            return flag
        })
        return res
    }

    sortPrice = (temp) => {
        let res = JSON.parse(JSON.stringify(temp))
        res.sort((a, b) => {
            let a_price = parseFloat(a.price.split('$')[1].replace(/,/g, ''))
            let b_price = parseFloat(b.price.split('$')[1].replace(/,/g, ''))
            return a_price - b_price
        })

        if (this.state.sortPrice_value === 'Low to High'){
            return res
        } else if (this.state.sortPrice_value === 'High to Low'){
            return res.reverse()
        } else {
            return temp
        }
    }

    allSubFilter = () => {
        this.setState({  showWhichResult: "filter" });
        let res
        let temp = this.props.searchResults
        res = this.filterNum('bedrooms', temp)
        res = this.filterNum('bathrooms', res)
        res = this.filterNum('guests', res)
        res = this.filterFeature(res)
        res = this.sortPrice(res.toJS())
        res = fromJS(res)
        this.props.filterProperty(res)
    }
    //############################################################

    render() {
        const { bed_value, bath_value, guest_value, showWhichResult } = this.state;
        const { homePropInfo, searchResults, filterResults } = this.props;
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const typeOptions = ['Apartment', 'Studio', 'House', 'Unit']
        const tagColors = ["red", "gold", "blue", "lime", "cyan", "purple", "orange", "volcano", "magenta", "geekblue"]

        let location, house_type, start_date, end_date;
        [location, house_type, start_date, end_date] = helpers.searchSubmit(getFieldsValue())

        const searchURL = "?location=" + location + "&type=" + house_type + 
                          "&start_date=" + start_date + "&end_date=" + end_date

        const marks = {1: "1+", 2: "2+", 3: "3+", 4: "4+", 5: "5+", 6: "6+"}
        const bedContent = (
            <Fragment>
               <Slider  min={1} 
                        max={6}
                        marks={marks}
                        value={bed_value}
                        onChange={this.handleBedNumChange}
                        tipFormatter={formatter}
                        style={{width: 240, marginBottom: "15%"}}/>
               <div style={{textAlign: "center"}}><Button type="primary" onClick={this.allSubFilter}>Apply</Button></div>
            </Fragment>
        );

        const bathContent = (
            <Fragment>
                <Slider min={1} 
                        max={6}
                        marks={marks}
                        value={bath_value}
                        onChange={this.handleBathNumChange}
                        tipFormatter={formatter}
                        style={{width: 240, marginBottom: "15%"}}/>
                <div style={{textAlign: "center"}}><Button type="primary" onClick={this.allSubFilter}>Apply</Button></div>
            </Fragment>
        );

        const guestContent = (
            <Fragment>
                <Slider min={1} 
                        max={6}
                        marks={marks}
                        value={guest_value}
                        onChange={this.handleGuestNumChange}
                        tipFormatter={formatter}
                        style={{width: 240, marginBottom: "15%"}}/>
                <div style={{textAlign: "center"}}><Button type="primary" onClick={this.allSubFilter}>Apply</Button></div>
            </Fragment>
        );

        const amenityOptions = ['TV', 'Wifi', 'Dryer', 'Washer', 'Air conditioning', "Self check-in"]
        const featureContent = (
            <Fragment>
                <Checkbox.Group defaultValue={[]} style={{marginBottom: "10%"}} onChange={(e) => this.handleFilterFeature(e)}>
                    { 
                        amenityOptions.map((item, index) => {
                            return (
                                <Fragment key={index}>
                                    <Checkbox style={{ height: "30px", lineHeight: "30px" }} key={index} value={item}>{item}</Checkbox>
                                    <br/>
                            </Fragment>
                            )
                        })
                    }
                </Checkbox.Group>
                <br/>
                <Button type="primary" onClick={this.allSubFilter}>Apply</Button>
            </Fragment>
        );

        const sortOptions = ['Default', 'Low to High', 'High to Low']
        const sortPrice = (
            <Fragment>
                <Radio.Group style={{marginBottom: "10%"}} defaultValue="Default" onChange={(e) => this.handleSortPrice(e.target.value)}>
                { 
                    sortOptions.map((item, index) => {
                        return (
                            <Fragment key={index}>
                                <Radio style={{ height: "30px", lineHeight: "30px" }} key={index} value={item}>{item}</Radio>
                                <br/>
                            </Fragment>
                        )
                    })
                }
                </Radio.Group>
                <br/>
                <Button type="primary" onClick={this.allSubFilter}>Apply</Button>
            </Fragment>
        );

        const AnyReactComponent = ({ text, index }) =>
            <div className = {`item ${index === this.state.target ? "item_hover" : "null"}`}>
                <span className='map_item_text'>{text}</span>
            </div>;

        // showWhichResult: "search", "filter"
        // filterResults
        let part_results = [];
        if (showWhichResult === "search") {
            if (searchResults){
                if (this.state.current === 1) {
                    part_results = searchResults.slice(0, this.state.pageSize)
    
                } else {
                    let start = (this.state.current - 1) * this.state.pageSize;
                    let end = start + this.state.pageSize;
                    part_results = searchResults.slice(start, end)
                }
            }
        } else {
            if (filterResults){
                if (this.state.current === 1) {
                    part_results = filterResults.slice(0, this.state.pageSize)
    
                } else {
                    let start = (this.state.current - 1) * this.state.pageSize;
                    let end = start + this.state.pageSize;
                    part_results = filterResults.slice(start, end)
                }
            }
        }
        
        // same as home page2: same locationOptions
        let locationOptions = []
        if (homePropInfo !== null){
            locationOptions =  helpers.getLocationOptions(homePropInfo)
        }


        return (
            <div className="searchContent">
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
                            }) ( <RangePicker 
                                            disabledDate={this.disabledDate}
                                            ranges={{ Today: [moment(), moment()], 
                                            'This Month': [moment(), moment().endOf('month')]}}/>)
                        }
                    </Form.Item>
                    <Form.Item>
                        <Link to={{pathname: "/search", search: searchURL}}>
                            <Button type="primary" style={{width: 100}} onClick={this.handleSubmit}> Search</Button>
                        </Link>
                    </Form.Item>
                </Form>

                <div className="filterBar">
                    <Popover content={bedContent} title="Bedroom number" placement="bottomLeft">
                        <Button className="filterButton">Bedrooms</Button>
                    </Popover>
                    <Popover content={bathContent} title="Bathroom number" placement="bottom">
                        <Button className="filterButton">Bathrooms</Button>
                    </Popover>
                    <Popover content={guestContent} title="Accomodate number" placement="bottom">
                        <Button className="filterButton">Guests</Button>
                    </Popover>
                    <Popover content={featureContent} title="Features" placement="bottom">
                        <Button className="filterButton">Features</Button>
                    </Popover>
                    <Popover content={sortPrice} title="Sort price" placement="bottom">
                        <Button className="filterButton">Sort Price</Button>
                    </Popover>
                </div>

                <Row className="searchResult">
                    <Col span={12} style={{height: "120vh"}}>
                        <div style={{height: "110vh", overflow: "auto"}}>
                        {   
                            part_results.size === 0 ? 
                            <Fragment>
                            <Empty description={<span>Sorry, no search result!</span>} style={{marginTop: "100px"}}/>
                            <Link to="/requests">
                                <div style={{textAlign: "center", marginTop: "30px"}}><Button type="primary">Go To Post Request</Button></div>
                            </Link>
                            </Fragment> : 
                            part_results.map((item, index) => {
                                const price = item.get('price').split('.')[0]
                                const amenities = item.get('amenities').slice(1, -1).split(',')
                                let latitude = item.get('latitude')
                                let longitude = item.get('longitude')
                                return (
                                    <div 
                                        key={index}
                                        className="oneProp" 
                                        onMouseEnter={this.handleMouseOver.bind(this, index, latitude, longitude)}
                                        onMouseLeave={this.handleMouseLeave}
                                    >
                                        <Link to={`/props/${ item.get('property_id')}`}>
                                            <img src={item.get('image').get(0)} 
                                                onError={(e) => e.target.src=`${item.get('image').get(0)}`}
                                                alt="" className="image"/>
                                        </Link>
                                        {/* detail */}
                                        <div className="detail">
                                            <span className="propType">
                                                <Icon type="star"/> Entire {item.get('property_type')}
                                            </span>
                                            <Link to={`/props/${ item.get('property_id')}`}>
                                                <div className="title">{item.get('title')}</div>
                                            </Link>

                                            <div className="roomsLocation">
                                                <Icon type="home" theme="twoTone" style={{marginRight: "1%"}}/>
                                                <span>
                                                    {item.get('bedrooms')} {item.get('bedrooms') > 1 ? "bedrooms · " : "bedroom · "}
                                                </span>
                                                <span style={{marginRight: "3%"}}>
                                                    {item.get('bathrooms')} {item.get('bathrooms') > 1 ? "bathrooms" : "bathroom"}
                                                </span>
                                                <span style={{color: "#ad6800"}}>
                                                    <Icon type="environment" style={{marginRight: "1%"}}/> 
                                                    {item.get('suburb')} · NSW
                                                </span>
                                            </div>
                                            <div className="amenityTags">
                                            {
                                                amenities.slice(0, 5).map((element, index) => {
                                                    let indexList = index.toString().split('')
                                                    let newIndex = parseInt(indexList[indexList.length - 1])
                                                    return(
                                                        <Tag key={index} color={tagColors[newIndex]} style={{ marginBottom: 10}}>
                                                            {element}
                                                        </Tag>)
                                                })
                                            }
                                            </div>
                                            <div className="priceLine">
                                                <span className="price">{`${price} AUD `}</span>
                                                <span>/night</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        </div>
                        <Pagination
                            showSizeChanger
                            onShowSizeChange={this.onShowSizeChange}
                            defaultCurrent={1}
                            defaultPageSize={10}
                            pageSizeOptions={['5', '10', '15', '20']}
                            current={this.state.current}
                            total={ showWhichResult === "search" ? 
                                    searchResults === null ? 10 : searchResults.size : 
                                    filterResults === null ? 10 : filterResults.size}
                            onChange={ (page) => this.setState({ current: page }) }
                            className="pagination"
                        />
                    </Col>
                    <Col span={12}>
                        {/* Important! Always set the container height explicitly */}
                        <GoogleMapReact style={{ height: '120vh', width: '100%' }}
                            bootstrapURLKeys={{key:'AIzaSyDsg88VPvJzXpu_6S3ycJpfipLcm1FG_xk'}}
                            center={this.state.center}
                            defaultZoom={this.state.zoom}>   
                            {
                                part_results !== null ?
                                part_results.map((item, index) => {
                                    return (<AnyReactComponent
                                                key={index}
                                                index={index}
                                                lat={item.get('latitude')}
                                                lng={item.get('longitude')}
                                                text={item.get('price')}
                                            />)
                                 }) : null
                            }
                        </GoogleMapReact>
                    </Col>
                </Row>
            </div>
          );
    }

    UNSAFE_componentWillMount(){
        if (!this.props.homePropInfo) {
            this.props.getHomeInfo()
        }
        if (cookie.load('userInfo')){
            this.props.isLogin(cookie.load('userInfo'))
        }

        let temp = this.props.location.search
        let exp = /^\?location=\w*[ \w*]*&type=\w*&start_date=([\d]{4}-[\d]{2}-[\d]{2})*&end_date=([\d]{4}-[\d]{2}-[\d]{2})*/g
        if (!temp.match(exp)){
            this.props.search("", "", "", "")
        } else {
            let searchURL = this.props.location.search.split('&')
            let urlList = []
            searchURL.map((item, index) => {
                return(
                    urlList.push(item.split('=')[1])
                )
            })
            let location, house_type, start_date, end_date
            [location, house_type, start_date, end_date] = urlList
            this.props.search(location, house_type, start_date, end_date)
        }
    }

}



const mapState = (state) => {
	return {
        loginStatus: state.getIn(["combo", "loginStatus"]),
        homePropInfo: state.getIn(["combo", "homePropInfo"]),
        searchResults: state.getIn(["combo", "searchResults"]),
        filterResults: state.getIn(["combo", "filterResults"]),
	}
}

const mapDispatch = (dispatch) => ({
    isLogin(token){
        dispatch(actionCreators.isLogin(token))
    },
    getHomeInfo() {
        dispatch(actionCreators.getHomeInfo())
    },
    search(location, house_type, start_date, end_date) {
		dispatch(actionCreators.search(location, house_type, start_date, end_date))
    },
    filterProperty(temp) {
        dispatch(actionCreators.filterProperty(temp))
    }
});


export default connect(mapState, mapDispatch)(Form.create()(Search));







