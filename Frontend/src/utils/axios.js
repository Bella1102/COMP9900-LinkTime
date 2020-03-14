import JsonP from 'jsonp';
import axios from 'axios';
import { Modal } from 'antd';
import * as Utils from './utils';


class Axios {

    static requestList(_this, url, params, isMock){
        var data = {
            params: params,
            isMock
        }
        this.ajax({
            url, data
        }).then((data)=>{
            if (data && data.result){
                let list = data.result.item_list.map((item, index) => {
                    item.key = index;
                    return item;
                });
                _this.setState({
                    list,
                    pagination: Utils.pagination(data, (current) => {
                        _this.params.page = current;
                        _this.requestList();
                    })
                })
            }
        });
    }

    static jsonp(options) {
        return new Promise((resolve, reject) => {
            JsonP(options.url, {
                param: 'callback'
            }, function (err, response){
                if (response.status === 'success') {
                    resolve(response);
                } else {
                    reject(response.messsage);
                }
            })
        })
    }

    static ajax(options){
        let loading;
        if (options.data && options.data.isShowLoading !== false){
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block';
        }
        // my easy-mock: 'https://www.easy-mock.com/mock/5deacf8048997e73bd3bcbeb/mockapi'
        let baseApi = 'https://www.easy-mock.com/mock/5a7278e28d0c633b9c4adbd7/api';
        return new Promise((resolve, reject) => {
            axios({
                url: options.url,
                method: 'get',
                baseURL: baseApi,
                timeout: 5000,
                params: options.data && options.data.params
            }).then((res) => {
                if (options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                if (res.data.code === '0'){
                    resolve(res.data);
                } else {
                    Modal.info({ title: "提示", content: res.data.msg })
                }  
            }).catch(() => {
				console.log("utils axios error")
			});
        });
    }
}


export default Axios;