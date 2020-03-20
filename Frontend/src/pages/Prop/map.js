import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { Pagination } from '@ant-design/icons';
import marker from './marker.png';
import './index.less';


const loc = [
    [-33.86917, 151.22656, 65],
    [-33.86515, 151.1919, 76],
    [-33.87888, 151.21439 , 100]
]

const AnyReactComponent = ({ text }) => {
  return (
    <div className='item'>
		<img src={marker}></img>
		<span className='map_item_text'>{text}</span>
    </div>
  )
};


//当hover的时候，把center的值改变为当前鼠标悬浮的property位置
class SimpleMap extends Component {

	constructor(props){
		super(props);
		// this.handleMouseOver = this.handleMouseOver.bind(this);
		this.state = {
			center: { lat: -33.86917, lng: 151.22656 },
			zoom: 11,
			target: -1
		};

	}
	render() {
		return (
			// Important! Always set the container height explicitly
			<div>
				<GoogleMapReact
					bootstrapURLKeys={{key:'AIzaSyDsg88VPvJzXpu_6S3ycJpfipLcm1FG_xk'}}
					defaultCenter={this.state.center}
					defaultZoom={this.state.zoom}>

					{
						loc.map((value,index) => {
							console.log(index)
							return (
								<div className={`item ${index === this.state.target ? "item_hover" : "null"}`}
									key={index}
									lat={value[0]}
									lng={value[1]}>
								
									<img src={marker}></img>
									<span className='map_item_text'>{'$'+value[2]}</span>
								</div>)
						})
					}
				</GoogleMapReact>
			</div>
		);
	}
}

export default SimpleMap;


