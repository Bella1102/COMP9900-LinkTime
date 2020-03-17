from flask import request
from flask_restplus import Namespace, Resource

import db.init_db as db
from utils.helpers import *
from utils.models import auth_details, update_userInfo


user = Namespace('user', description='User Information')


@user.route('/')
class User(Resource):

    @user.response(200, 'Success')
    @user.response(400, 'Missing Arguments')
    @user.response(403, 'Invalid Auth Token')
    @user.expect(auth_details(user))
    @user.doc(description='''Get user information.''')
    def get(self):
        user = authorize(request)
        user_id = request.args.get('user_id', None)
        if (user_id is not None):
            session = db.get_session()
            user = session.query(db.User).filter_by(id=user_id).first()
            session.close()
        return {
            "id": user.id,
            'username': user.username,
            'email': user.email,
            'phone': user.phone,
            'token': user.token
        }

    @user.response(200, 'Success')
    @user.response(400, 'Missing Arguments')
    @user.response(403, 'Invalid Auth Token')
    @user.expect(auth_details(user), update_userInfo(user))
    @user.doc(description='''Update user information. 
        The given object can update username, password, email, or phone number.
        At least one of above must be supplied or the request is considered malformed.''')
    def put(self):
        user = authorize(request)
        user_id = int(user[0])
        if not request.json:
            abort(400, 'Malformed request')
        safe = {}
        allowed_keys = ['username', 'password', 'email', 'phone']
        valid_keys = [k for k in request.json.keys() if k in allowed_keys]
        if len(valid_keys) < 1:
            abort(400, 'Malformed request')
        if "password" in valid_keys and request.json["password"] == "":
            abort(400, 'Malformed request')
        for k in valid_keys:
            safe[k] = request.json[k]
        db.update('User').set(**safe).where(id=user_id).execute()
        return {
            'message': 'success'
        }

