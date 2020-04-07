
export const BACKEND_URL = 'http://127.0.0.1:5000';


export function searchSubmit(values) {

    if (values.type === undefined) {
        var house_type = '';
    } else {
        house_type = values.type;
    }
    if (values.time === '' || values.time === undefined  || values.time.length === 0) {
        var start_date = '';
        var end_date = '';
    } else {
        start_date = values.time[0].format('YYYY-MM-DD');
        end_date = values.time[1].format('YYYY-MM-DD');
    }
    if (values.location === '' || values.location === undefined || values.location.length === 0) {
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
        let sort_suburb = states[key].sort()
        sort_suburb.map((val) => {
            suburb.push({value: val, label: val})
            return null
        })
        locationList.push({value: key, label: key, children: suburb })
    }
    return locationList;
}







