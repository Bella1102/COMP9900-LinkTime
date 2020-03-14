import React from 'react';
import { Select } from 'antd';


// for format time
function addZero(n) {
    return n < 10 ? '0' + n : n;
}

// format time
export function formatTime(timestamp) {
    var time = new Date(parseInt(timestamp));
    var Y = time.getFullYear();
    var Mo = time.getMonth() + 1; 
    var D = time.getDate(); 
    var H = time.getHours(); 
    var Mi = time.getMinutes(); 
    var S = time.getSeconds(); 
    var formatYMD = Y + '-' + addZero(Mo) + '-' + addZero(D);
    var formatHMS = addZero(H) + ':' + addZero(Mi) + ':' + addZero(S);
    var formatTime =  formatYMD + ' ' + formatHMS;
    return formatTime;
}

export function pagination(data, callback){
    return {
        onChange: (current) => {
            callback(current)
        },
        current: data.result.page,
        pageSize: data.result.page_size,
        total: data.result.total_count,
        showTotal: () => {
            return `共${data.result.total_count}条`
        },
        showQuickJumper: true
    }
}

export function getOptionList(data){
    if(!data){
        return [];
    }
    let options = [];
    data.map((item) => {
        options.push(<Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>);
        return null;
    })
    return options;
}

export function updateSelectedItem(selectedRowKeys, selectedItem, selectedIds){
    if (selectedIds){
        this.setState({
            selectedRowKeys,
            selectedItem,
            selectedIds
        })
    } else{
        this.setState({
            selectedRowKeys,
            selectedItem
        })
    }
}


