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




