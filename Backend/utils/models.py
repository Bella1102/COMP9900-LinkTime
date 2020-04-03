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
    'phone': fields.String(required=True, example='0452666888')
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
        'start_date': fields.String(example='2020-05-10'),
        'end_date': fields.String(example='2020-05-15'),
        'other_details': fields.String(example='Room available in a family home in a lovely safe leafy suburb'),
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

