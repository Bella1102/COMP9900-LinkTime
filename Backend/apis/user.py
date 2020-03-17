import hashlib
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
    @user.param('user_id', 'the id of the user')
    @user.doc(description='''Get login user info by token or get other user info by token and user_id.''')
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
            'phone': user.phone
        }

    @user.response(200, 'Success')
    @user.response(400, 'Missing Arguments')
    @user.response(403, 'Invalid Auth Token')
    @user.response(409, 'Username Taken')
    @user.expect(auth_details(user), update_userInfo(user))
    @user.doc(description='''Update user information. 
        The given object can update username, password or phone number.
        At least one of above must be supplied or the request is considered malformed.''')
    def put(self):
        user = authorize(request)
        (username, password, phone) = unpack(request.json, 'username', 'password', 'phone')
        if username == None and password == None and phone == None:
            abort(400, 'Missing Arguments')
        session = db.get_session()
        user = session.query(db.User).filter_by(token=user.token).first()
        check_username = session.query(db.User).filter_by(username=username).first()
        password_bytes = password.encode()
        hash_password = hashlib.sha256(user.key + password_bytes).hexdigest()
        if check_username != None:
            abort(409, 'Username Taken')
        user.username = username
        user.password = hash_password
        user.phone = phone
        session.commit()
        session.close()
        return { 'message': 'success'}

