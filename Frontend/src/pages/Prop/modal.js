import React from 'react';
import { Modal, Button } from 'antd';
import './modal.less';
import './oneProp.less';




class Newmodal extends React.Component {
    
    state = { 
        visible: this.props.visible,
        which_img: 0
    };

    showModal = () => {
        this.setState({
        visible: true,
        });
    };

    hideModal = () => {
        this.setState({
        visible: false,
        });
    };

    handleClickRight = () => {
        let which_img = this.state.which_img

        this.setState({
            which_img: (which_img+1) % this.props.img_url.size
        })
    }
    
    handleClickLeft = () => {
        let which_img = this.state.which_img
        
        if (which_img - 1 < 0){
            which_img = which_img + this.props.img_url.size
        }else{
            which_img = which_img - 1
        }
        this.setState({
            which_img
        })
    }

  render() {

    return (
        <div>
            <Button className='showBtn' onClick={this.showModal}>
                Show Photos
            </Button>
            <Modal
                visible={this.state.visible}
                onCancel={this.hideModal.bind(this)}
                footer={null}
                style={{ marginTop: '-100px'}}
                width='100%'
                >   
            <div style={{display: 'flex', margin: 80, height: '100%'}}>
                <div className='imgs_box'>
                    <div className='arrow' onClick={this.handleClickLeft}>
                        <svg viewBox="0 0 18 18" role="presentation" aria-hidden="true" focusable="false" style={{height: "24px", width: "24px", fill: "rgb(72, 72, 72)"}}>
                            <path d="m13.7 16.29a1 1 0 1 1 -1.42 1.41l-8-8a1 1 0 0 1 0-1.41l8-8a1 1 0 1 1 1.42 1.41l-7.29 7.29z" fillRule="evenodd">
                            </path>
                        </svg>
                    </div>
                    <div className='imgs'>
                        <img src = {this.props.img_url.get(this.state.which_img)} className='big_img' alt=''/>
                    </div>
                    <div className='arrow' onClick={this.handleClickRight}>
                        <svg viewBox="0 0 18 18" role="presentation" aria-hidden="true" focusable="false" style={{height: "24px", width: "24px", fill: "rgb(72, 72, 72)"}}>
                            <path d="m4.29 1.71a1 1 0 1 1 1.42-1.41l8 8a1 1 0 0 1 0 1.41l-8 8a1 1 0 1 1 -1.42-1.41l7.29-7.29z" fillRule="evenodd">
                            </path>
                        </svg>
                    </div>
                </div>
                <div style={{width: '27%'}}>
                    <div className='imgs_gallery'>
                        {   
                            this.props.img_url.map((item, index)=>{
                                
                                if (index < (this.state.which_img - 2)  || index > (this.state.which_img + 2) ){
                                    return (<div key={index} className="base" style={{ display: 'none'}}>
                                        <img src={item} className='small_img' alt=''/>
                                    </div>)
                                }else{
                                    if (index !== this.state.which_img){
                                        return (<div key={index} className="base" style={{filter: 'blur(1px)'}}>
                                        <img src={item} className='small_img' alt=''/>
                                        </div>)
                                    }else{
                                        return (<div key={index} className="base" style={{height: '100%'}}>
                                        <img src={item} className='small_img' style={{border: '3px solid black'}} alt=''/>
                                        </div>)
                                    }
                                }
                            })
                        }
                    </div>
                    <div className='img_alt'>
                        <p>{`${this.state.which_img+1}/${this.props.img_alt.size}`}</p>
                        <p>{this.props.img_alt.get(this.state.which_img)}</p>
                    </div>
                </div>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            </Modal>
        </div>
    );
  }
}

export default Newmodal;
