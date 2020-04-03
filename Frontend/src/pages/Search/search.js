import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import GoogleMapReact from 'google-map-react';
import { Form, DatePicker, Cascader, Button, Select, Row, Col, Pagination, Icon } from 'antd';
import { actionCreators } from '../../redux/oneStore';
import * as helpers from '../../utils/helpers';
import './search.less';


const { Option } = Select;
const { RangePicker } = DatePicker;


class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            center: { lat: -33.86917, lng: 151.22656 },
            zoom: 15,
            target: -1,
            current: 1,
            pageSize: 10
        };
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
      }

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

    onChange = page => {
        this.setState({
            current: page
        })
    }
    onShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSize: pageSize
        })
    }

    render() {

        const { homePropInfo, searchResults } = this.props;
        const { getFieldDecorator } = this.props.form;

        const AnyReactComponent = ({ text, index }) =>
            <div className = {`item ${index === this.state.target ? "item_hover" : "null"}`}>
                <span className='map_item_text'>{text}</span>
            </div>;

        let part_results = [];
        if (searchResults){
            if (this.state.current === 1) {
                part_results = searchResults.slice(0, this.state.pageSize)

            } else {
                let start = (this.state.current - 1) * this.state.pageSize;
                let end = start + this.state.pageSize;
                part_results = searchResults.slice(start, end)
            }
        }

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

                <div className="filterBar">
                    <Button className="filterButton">Location</Button>
                    <Button className="filterButton">Dates</Button>
                    <Button className="filterButton">Guests</Button>
                    <Button className="filterButton">Price</Button>
                    <Button className="filterButton">Features</Button>
                    <Button className="filterButton">Property type</Button>
                </div>

                <Row className="searchResult">
                    <Col span={12} style={{height: "120vh"}}>
                        <div style={{height: "110vh", overflow: "auto"}}>
                        {   
                            part_results !== null ?
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
                                        <Link to={`/prop/${ item.get('property_id')}`}>
                                            <img src={item.get('image').get(1)} alt="" className="image"/>
                                        </Link>
                                        {/* detail */}
                                        <div className="detail">
                                            <Link to={`/prop/${ item.get('property_id')}`}>
                                                <div className="title">{item.get('title')}</div>
                                            </Link>
                                            <div className="location"> <Icon type="environment"/> {item.get('suburb')} · NSW</div>
                                            <div style={{height: 35}}>
                                                <span className="type">{`${item.get('property_type')}: `}</span>
                                                <span>{`${item.get('bedrooms')} bedroom · `}</span>
                                                <span>{`${item.get('bathrooms')} bath`}</span>
                                            </div>
                                            <div style={{height: 35}}>
                                                <span style={{ marginRight: 5}}>{`${amenities[0]}`}</span>
                                                <span style={{ marginRight: 5}}>{`${amenities[1]}`}</span>
                                                <span style={{ marginRight: 5}}>{`${amenities[2]}`}</span>
                                            </div>
                                            <div className="priceLine">
                                                <span className="price">{`${price} AUD `}</span>
                                                <span>/night</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : null
                        }
                        </div>
                        <Pagination
                            showSizeChanger
                            onShowSizeChange={this.onShowSizeChange}
                            defaultCurrent={1}
                            defaultPageSize={10}
                            pageSizeOptions={['5', '10', '15', '20']}
                            current={this.state.current}
                            total={searchResults === null ? 10 : searchResults.size}
                            onChange={this.onChange}
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
        this.props.getHomeInfo();

    }

}



const mapState = (state) => {
	return {
        loginStatus: state.getIn(["combo", "loginStatus"]),
        homePropInfo: state.getIn(["combo", "homePropInfo"]),
        searchResults: state.getIn(["combo", "searchResults"]),
        propDetail: state.getIn(["combo", "propDetail"]),
	}
}

const mapDispatch = (dispatch) => ({
    getHomeInfo() {
        dispatch(actionCreators.getHomeInfo())
    },
    search(location, house_type, start_date, end_date) {
		dispatch(actionCreators.search(location, house_type, start_date, end_date))
    } 
});


export default connect(mapState, mapDispatch)(Form.create()(Search));







