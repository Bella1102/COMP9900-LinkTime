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

def register_details(api):
    return api.model('register_details', {
    'username': fields.String(required=True, example='Link1'),
    'password': fields.String(required=True, example='111111'),
    'first_name': fields.String(required=True, example='Eric'),
    'last_name': fields.String(required=True, example='Trump'),
    'role': fields.String(required=True, example='host'),
    'email': fields.String(required=True, example='123456@gmail.com'),
    'telephone': fields.String(required=True, example='0452666888')
    })

def update_userInfo(api):
    return api.model('update_userInfo', {
    # need to be updated
    'username': fields.String(required=True, example='Linda'),
    'password': fields.String(required=True, example='123456'),
    'email': fields.String(required=True, example='123456@gmail.com')
    })

def property_details(api):
    return api.model('property_details', {
    # need to be updated
    'username': fields.String(required=True, example='Linda'),
    'password': fields.String(required=True, example='123456')
    })


