from flask_restplus import fields


def auth_details(api):
    return api.parser().add_argument('Authorization', 
                                    help="Your Authorization Token in the form '<AUTH_TOKEN>'", 
                                    location='headers')

def login_details(api):
    return api.model('login_details', {
    'username': fields.String(required=True, example='Link'),
    'password': fields.String(required=True, example='123123'),
    })

def signup_details(api):
    return api.model('signup_details', {
    'username': fields.String(required=True, example='Linda'),
    'password': fields.String(required=True, example='123123'),
    'email': fields.String(required=True, example='555666@gmail.com'),
    'phone': fields.String(required=True, example='0452666888'),
    'avatar': fields.String(required=False, example='head.png')
    })

def user_details(api):
    return api.model('user_details', {
    'id': fields.Integer(min=0),
    'username': fields.String(example='Link'),
    'email': fields.String(example='123456@gmail.com'),
    'phone':  fields.String(example='0452666666')
    })

def update_userInfo(api):
    return api.model('update_userInfo', {
    'username': fields.String(required=True, example='Link666'),
    'password': fields.String(required=True, example='123456'),
    'phone': fields.String(required=True, example='0452666666')
    })

def search_params(api):
    return api.model('search_results', {
    'house_type': fields.String(example='House'),
    'location': fields.String(example='Sydney'),
    'start_date': fields.String(example='2020-05-10'),
    'end_date': fields.String(example='2020-05-15'),
    })

def property_details(api):
    return api.model('property_details', {
    # need to be updated
        'title': fields.String(example='Perfect Apartment'),
        'type': fields.String(example='House or Studio or Apartment'),
        'amenities': fields.String(example="{'TV', 'Wifi', 'Iron'...}"),
        'price': fields.String(example='$160'),
        'state': fields.String(example='New South Wales'),
        'suburb': fields.String(example='Maroubra'),
        'location': fields.String(example='123 Anzac Rd'),
        'postcode': fields.String(example='2035'),
        'bedrooms': fields.String(example='1'),
        'bathrooms': fields.String(example='1'),
        'accommodates': fields.String(example='2'),
        'start_date': fields.String(example='2020-05-10'),
        'end_date': fields.String(example='2020-05-15'),
        'other_details': fields.String(example='Room available in a family home in a lovely safe leafy suburb'),
        'house_rules': fields.String(example='No Smoking'),
        'filename': fields.List(fields.String, description='img_name', example=['img1.png', 'img2.png']),
    })

def order_details(api):
    return api.model('order_details', {
        'property_id': fields.String(example='11156'),
        'checkIn':  fields.String(example='2020-04-10'),
        'checkOut': fields.String(example='2020-04-15'),
        'guests': fields.String(example='2')
    })

def review_details(api):
    return api.model('review_details', {
        'property_id': fields.String(example='11156'),
        'review_content': fields.String(example='Perfet Apartment!')
    })

def requests_details(api):
    return api.model('request_details', {
        'request_title': fields.String(example='I need a House'),
        'request_content': fields.String(example='I want to rent a house seven days!')
    })

def del_requests(api):
    return api.model('del_requests', {
        'req_id': fields.String(example='1'),
    })

def update_property_details(api):
    return api.model('update_property_details', {
    # need to be updated
        'title': fields.String(example='Perfect Apartment'),
        'amenities': fields.String(example="{'TV', 'Wifi', 'Iron'...}"),
        'price': fields.String(example='$160'),
        'start_date': fields.String(example='2020-05-10'),
        'end_date': fields.String(example='2020-05-15'),
        'other_details': fields.String(example='Room available in a family home in a lovely safe leafy suburb'),
        'house_rules': fields.String(example='No Smoking'),
        'filename': fields.List(fields.String, description='img_name', example=['img1.png', 'img2.png']),
    })

def comment_request_details(api):
    return api.model('comment_request_details', {
        'comment_content': fields.String(example='I have a house that might suit you.'),
    })