import secrets
from flask_restplus import abort
import db.init_db as db
import requests
import random
import time

head_picture_url = 'https://www.logoshirt-shop.de/out/pictures/master/product/1/kuehlschrankmagnet-mickey_mouse_portrait_farbig.jpg'

def gen_token():
    token = secrets.token_hex(32)
    return token

def unpack(j, *args, **kargs):
    res = [j.get(arg, None) for arg in args]
    if kargs.get("required", True):
        [abort(kargs.get("Missing Arguments", 400)) for e in res if e == None]
    return res

def authorize(request):
    res = request.headers.get('Authorization', None)
    if not res:
        abort(403, 'Unsupplied Authorization Token')
    session = db.get_session()
    user = session.query(db.User).filter_by(token=res).first()
    session.close()
    if not user:
        abort(403, 'Invalid Authorization Token')
    return user

# '2020-3-22' -> 1584795600
def getTimeStamp(time_str):
    timeArray = time.strptime(time_str, '%Y-%m-%d')
    res = time.mktime(timeArray)
    return round(res)


def generatePropertyId():
    while True:
        pro_id = random.randint(10000, 100000)
        session = db.get_session()
        pro_info = session.query(db.Property).filter_by(property_id=pro_id).first()
        if not pro_info:
            break
    return pro_id

# rsplit from right to right
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in set(['png', 'jpg', 'jpeg', 'gif'])

# def getGeoInfo(latitude,longitude):
#     key = 'AIzaSyDsg88VPvJzXpu_6S3ycJpfipLcm1FG_xk'
#     base_url = 'https://maps.googleapis.com/maps/api/geocode/json?'
#     parameters = 'latlng=' + str(latitude) + ',' + str(longitude)
#     geo_info = requests.get(base_url + parameters + '&key=' + key).json()
#     res = geo_info["results"][0]["formatted_address"].rsplit(',', 1)[0]
#     return res
def getLatLng(state, suburb, location,):
    key = 'AIzaSyDsg88VPvJzXpu_6S3ycJpfipLcm1FG_xk'
    base_url = 'https://maps.googleapis.com/maps/api/geocode/json?'
    parameters = 'address=%s+%s+%s' % (location, suburb,state)
    geo_info = requests.get(base_url + parameters + '&key=' + key).json()
    res = geo_info["results"][0]['geometry']['location']
    return [round(res['lat'], 6), round(res['lng'], 6)]

def getAllPropInfo(data):
    return{
        "id": data.id,
        "property_id": data.property_id,
        'title': data.title,
        'property_type': data.property_type,
        'amenities': amenities,
        'price': data.price,
        'bedrooms': data.bedrooms,
        'bathrooms': data.bathrooms,
        'accommodates': data.accommodates,
        'minimum_nights': data.minimum_nights,
        'description': data.description,
        'notes': data.notes,
        'house_rules': data.house_rules,
        'start_time': data.start_time,
        'end_time': data.end_time
    }
def changeTextToList(img_str):
    res = img_str[1:-1].split(', ')
    return [ele[1:-1] for ele in res]

def getReviewOneProperty(rev_obj):
    out = []
    for i in rev_obj:
        temp = {
            "reviewer_id": i.reviewer_id,
            "reviewer_name": i.reviewer_name,
            "review_date": i.review_date,
            "review_content": i.review_content,
            "head_picture": i.head_picture
        }
        out.append(temp)
    return out


def searchResult(pro_obj, img_obj, add_obj):
    img_list = img_obj.img_url[1:-1].split(', ')
    img_list = [ele[1:-1] for ele in img_list]
    temp = {
        "property_id": add_obj.property_id,
        "latitude": round(add_obj.latitude, 5),
        "longitude": round(add_obj.longitude, 5),
        "suburb": add_obj.suburb,
        "image": img_list,
        "property_type": pro_obj.property_type,
        "amenities": pro_obj.amenities.replace('"', ''),
        "price": pro_obj.price,
        "bedrooms": pro_obj.bedrooms,
        "bathrooms": pro_obj.bathrooms,
        "title": pro_obj.title,
    }
    return temp
def getPropertyInfo(pro_obj, img_obj, add_obj, rev_obj, host_obj):

    if pro_obj and img_obj and add_obj and rev_obj and host_obj:
        img_url_list = changeTextToList(img_obj.img_url)
        img_alt_list = changeTextToList(img_obj.img_alt)
        all_review   = getReviewOneProperty(rev_obj)
        pro_info = {
            # property information
            "property_id": pro_obj.property_id,
            "title": pro_obj.title,
            "property_type": pro_obj.property_type,
            "amenities": pro_obj.amenities.replace('"', ''),
            "price": pro_obj.price,
            "bedrooms": pro_obj.bedrooms,
            "bathrooms": pro_obj.bathrooms,
            "accommodates": pro_obj.accommodates,
            "minimum_nights": pro_obj.minimum_nights,
            "description": pro_obj.description,
            "notes": pro_obj.notes,
            "house_rules": pro_obj.house_rules,
            "start_time": pro_obj.start_time,
            # image information
            "img_alt": img_alt_list,
            "img_url": img_url_list,
            # address information
            "latitude": round(add_obj.latitude, 6),
            "longitude": round(add_obj.longitude, 6),
            "location": add_obj.location,
            #review
            "reviews": all_review,
            #host
            "host_id": host_obj.host_id,
            "host_name": host_obj.host_name,
            "host_img_url": host_obj.host_img_url,
            "host_verifications": host_obj.host_verifications,
        }
    if pro_obj and not img_obj and add_obj and not rev_obj and host_obj:
        pro_info = {
            # property information
            "property_id": pro_obj.property_id,
            "title": pro_obj.title,
            "property_type": pro_obj.property_type,
            "amenities": pro_obj.amenities.replace('"', ''),
            "price": pro_obj.price,
            "bedrooms": pro_obj.bedrooms,
            "bathrooms": pro_obj.bathrooms,
            "accommodates": pro_obj.accommodates,
            "minimum_nights": pro_obj.minimum_nights,
            "description": pro_obj.description,
            "notes": pro_obj.notes,
            "house_rules": pro_obj.house_rules,
            "start_time": pro_obj.start_time,
            # address information
            "latitude": round(add_obj.latitude, 6),
            "longitude": round(add_obj.longitude, 6),
            "location": add_obj.location,
            # host
            "host_id": host_obj.host_id,
            "host_name": host_obj.host_name,
            "host_img_url": host_obj.host_img_url,
            "host_verifications": host_obj.host_verifications,
        }

    return pro_info

