import secrets
from flask_restplus import abort
import db.init_db as db
import requests
import random
import time
import datetime
import os
from flask_mail import Message, Mail
from flask import render_template

BASE_HOST = 'http://127.0.0.1'
BASE_PORT = 5000

head_picture_url = 'https://www.logoshirt-shop.de/out/pictures/master/product/1/kuehlschrankmagnet-mickey_mouse_portrait_farbig.jpg'


base_img_url = BASE_HOST + ':' + str(BASE_PORT) + '/upload/?img_name='

def get_env_parameter():
    return os.getenv('BASE_HOST'), os.getenv('BASE_PORT')
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
    key = os.getenv('GOOGLE_MAP_KEY')
    base_url = 'https://maps.googleapis.com/maps/api/geocode/json?'
    parameters = 'address=%s+%s+%s' % (location, suburb,state)
    geo_info = requests.get(base_url + parameters + '&key=' + key).json()
    print()
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
    out.sort(key=lambda x: x['review_date'], reverse=True)
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
        'accommodates': pro_obj.accommodates
    }
    return temp
def getPropertyInfo(pro_obj, img_obj, add_obj, rev_obj, host_obj):
    img_info_dict = {}
    rev_info_dict = {"reviews": []}

    base_pro_info = {
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
        'available_dates': pro_obj.available_dates,
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
    if img_obj:
        img_url_list = changeTextToList(img_obj.img_url)
        img_alt_list = changeTextToList(img_obj.img_alt)
        img_info_dict = {
            # image information
            "img_alt": img_alt_list,
            "img_url": img_url_list,
        }
    if rev_obj:
        all_review = getReviewOneProperty(rev_obj)
        rev_info_dict = {"reviews": all_review}

    base_pro_info.update(img_info_dict)
    base_pro_info.update(rev_info_dict)
    return base_pro_info

def getOrderInfo(order_obj, pro_obj, img_obj, add_obj):
    img_url_list = changeTextToList(img_obj.img_url)
    temp={"order_id": order_obj.id,
          "property_id": order_obj.property_id,
          "order_time": order_obj.order_time,
          "checkIn": order_obj.checkIn,
          "checkOut": order_obj.checkOut,
          "guests": order_obj.guests,
          "order_status": order_obj.order_status,
          "comment_status": order_obj.comment_status,
          "title": pro_obj.title,
          "price": pro_obj.price,
          "img_url":img_url_list[0],
          "location": add_obj.location}
    return temp

def getAllProOfHost(ord_obj,pro_obj, img_obj, add_obj):
    ord_info={}
    img_url_list = changeTextToList(img_obj.img_url)
    temp = {
            "property_id": pro_obj.property_id,
            "title": pro_obj.title,
            "price": pro_obj.price,
            "img_url": img_url_list[0],
            "location": add_obj.location,
            "amenities": pro_obj.amenities,
            "description": pro_obj.description,
            "house_rules": pro_obj.house_rules}
    # if ord_obj:
    #     ord_info = {
    #         "order_id": order_obj.id,
    #         "property_id": order_obj.property_id,
    #         "order_time": order_obj.order_time,
    #         "checkIn": order_obj.checkIn,
    #         "checkOut": order_obj.checkOut,
    #         "guests": order_obj.guests,
    #         "order_status": order_obj.order_status }

    temp.update(ord_info)
    return temp

def dateRange(beginDate, endDate):
    dates = []
    dt = datetime.datetime.strptime(beginDate, "%Y-%m-%d")
    date = beginDate[:]
    while date <= endDate:
        dates.append(date)
        dt = dt + datetime.timedelta(1)
        date = dt.strftime("%Y-%m-%d")
    return dates

def getLocalTime():
    return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


def getCommentsOneRequest(com_info):
    out = []
    for i in com_info:
        temp = {
            "id": i.id,
            "commenter_id": i.commenter_id,
            "commenter_name": i.commenter_name,
            "comment_time": i.comment_time,
            "comment_content": i.comment_content,
            "commenter_avatar": i.commenter_avatar
        }
        out.append(temp)
    out.sort(key=lambda x: x['comment_time'], reverse=True)
    return out

def mail_config(app):
    app.config.update(
        MAIL_SERVER='smtp.sendgrid.com',
        MAIL_PORT=465,
        MAIL_USE_SSL=True,
        MAIL_DEFAULT_SENDER=('admin', "unswlinktime@gmail.com"),
        MAIL_MAX_EMAILS=10,
        MAIL_USERNAME="apikey",
        MAIL_PASSWORD=os.getenv('MAIL_PASSWORD')
    )
    return Mail(app)


def send_async_register_email(app, user_name, user_email):
    mail = mail_config(app)
    subject = 'Hello %s' % (user_name)

    message = "<div style=''>" \
              "<div style='height: 100px; width: 100%; background-color: #0073B1; text-align: center;line-height: 100px; font-size: 20px; font-weight: 600;color: #fff;'>" \
              "Welcome to LinkTime</div>" \
              "<div style='height: 400px; width: 100%; background-color: #fff; text-align: center;line-height: 400px; font-size: 20px; font-weight: 600;background-color:#f5f5f5''>" \
              "<a href='http://127.0.0.1:3000'>GO TO HOME PAGE</a></div></div>"

    msg = Message(subject=subject,
                  sender='unswlinktime@gmail.com',
                  recipients=[user_email],
                  html=message)

    with app.app_context():
        mail.send(msg)

    return 'send success'

def send_register_email(app, user_name, user_email):
    import threading
    thr = threading.Thread(target=send_async_register_email, args=[app, user_name, user_email])
    thr.start()
    return thr

def send_async_order_email(app, user_name,property_id, checkIn, checkOut, order_time, email):
    mail = mail_config(app)
    pro_url = 'http://localhost:3000/props/%s' % (property_id)
    subject = 'Hello %s, Please confirm your order.' % user_name
    message = "<div style='background: #e6f7ff'>" \
              "<div style='height:100px;background-color: #0073B1;text-align:center;line-height:100px;font-size:26px;font-weight:400;color:#fff;'>" \
              "Comfirm your order infomation" \
              "</div>" \
              "<div style='padding-left: 100px;'>" \
              "<p>Start time: %s </p>" \
              "<p>End time: %s </p>" \
              "<p>Order time: %s </p>" \
              "</div>" \
              "<div style='height:100px;background-color: #40a9ff;text-align:center;line-height:100px;font-size:20px;font-weight:400;color:#fff;'>" \
              "<a href=%s style='color: #fff'>GO TO THE PROPERTY PAGE</a>" \
              "</div>" \
              "</div>" % (checkIn, checkOut, order_time, pro_url)


    msg = Message(subject=subject,
                  sender='unswlinktime@gmail.com',
                  recipients=[email],
                  html=message)
    with app.app_context():
        mail.send(msg)

    return ''
def send_order_email(app, user_name, property_id,  checkIn, checkOut, order_time, email):
    import threading
    thr = threading.Thread(target=send_async_order_email, args=[app, user_name, property_id,  checkIn, checkOut, order_time, email])
    thr.start()
    return thr

