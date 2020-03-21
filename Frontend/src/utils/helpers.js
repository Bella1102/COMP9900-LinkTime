// import React from 'react';


export const BACKEND_URL = 'http://127.0.0.1:5000';


function addZero(n) {
    return n < 10 ? '0' + n : n;
}

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

export function searchSubmit(values) {

    if (values.type === undefined) {
        var house_type = '';
    } else {
        house_type = values.type;
    }
    if (values.time === '' || values.time[0] === undefined) {
        var start_date = '';
        var end_date = '';
    } else {
        start_date = values.time[0].format('YYYY-MM-DD');
        end_date = values.time[1].format('YYYY-MM-DD');
    }
    if (values.location === '' || values.location === undefined ) {
        var location = '';
    } else {
        location = values.location[1];
    }
    return [location, house_type, start_date, end_date]
}

export function getLocationOptions(homePropInfo) {
    let locationList = [];
    // 先将immutable数据类型转化为普通数据类型
    let propInfo = homePropInfo.toJS();
    let states = propInfo[0].state;
    for (let key in states){
        let suburb = []
        states[key].map((val) => {
            suburb.push({value: val, label: val})
            return null
        })
        locationList.push({value: key, label: key, children: suburb })
    }
    return locationList;
}







