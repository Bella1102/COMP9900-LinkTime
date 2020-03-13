import hashlib
from flask import request
from flask_restplus import Namespace, Resource, abort

import db.init_db as db
from utils.helpers import *
from utils.models import login_details, register_details


api = Namespace('auth', description='Authentication Services')

@api.route('/login')
class Login(Resource):

    @api.response(200, 'Success')
    @api.response(400, 'Missing Username/Password')
    @api.response(403, 'Invalid Username/Password')
    @api.expect(login_details(api))
    @api.doc(description='''
        Authenticate an existed account created through signup.
        Return an auth token which should be passed in subsequent calls to the api to verify the user.
    ''')
    def post(self):
        if not request.json:
            abort(400, 'Malformed Request')
        (username, password) = unpack(request.json, 'username', 'password')
        session = db.get_session()
        user = session.query(db.User).filter_by(username=username).first()
        if not user:
            abort(403,'Invalid Username/Password')
        password_bytes = password.encode()
        hash_password = hashlib.sha256(user.salt + password_bytes).hexdigest()
        if (hash_password != user.password):
            abort(403,'Invalid Username/Password')
        tok = gen_token()
        user.token = tok
        session.commit()
        session.close()
        return {
            'token': tok
        }

@api.route('/register')
class Register(Resource):

    @api.response(200, 'Success')
    @api.response(400, 'Missing Username/Password')
    @api.response(403, 'Invalid Username/Password')
    @api.expect(register_details(api))
    @api.doc(description='''Register a new account.''')
    def post(self):
        if not request.json:
            abort(400, 'Malformed Request')

        (username, password, first_name, last_name, role, email, telephone) = \
            unpack(request.json, 'username', 'password', 'first_name', 'last_name', 'role', 'email', 'telephone')
        session = db.get_session()
        new_user = db.User(username=username, password=password, first_name=first_name, last_name=last_name, role=role, email=email, telephone=telephone)
        session.add(new_user)
 
        session.commit()
        session.close()
        return {
            'message': 'success'
        }

    

