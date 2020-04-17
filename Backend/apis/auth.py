import os
import hashlib
from flask import request
from flask_restplus import Namespace, Resource, abort

import db.init_db as db
from utils.helpers import *
from utils.models import login_details, signup_details


auth = Namespace('auth', description='Authentication Services')

@auth.route('/login', strict_slashes=False)
class Login(Resource):

    @auth.response(200, 'Success')
    @auth.response(400, 'Missing Username/Password')
    @auth.response(403, 'Invalid Username/Password')
    @auth.expect(login_details(auth))
    @auth.doc(description='''
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
            abort(403, 'Invalid Username/Password')
        password_bytes = password.encode()
        hash_password = hashlib.sha256(user.key + password_bytes).hexdigest()
        if (hash_password != user.password):
            abort(403, 'Invalid Username/Password')
        t = gen_token()
        user.token = t
        session.commit()
        session.close()
        return { 'token': t }


@auth.route('/signup', strict_slashes=False)
class Register(Resource):

    @auth.response(200, 'Success')
    @auth.response(400, 'Malformed Request')
    @auth.response(409, 'Username Taken')
    @auth.response(410, 'Email Taken')
    @auth.expect(signup_details(auth))
    @auth.doc(description='''Register a new account. Username and email should be unique.''')
    def post(self):
        session = db.get_session()
        if not request.json:
            abort(400, 'Malformed Request')
        (username, password, email, phone, avatar) = unpack(request.json, 'username', 'password', 'email', 'phone', 'avatar')
        if username == '' or password == '' or email == '' or phone == '':
            abort(400, 'Malformed Request')
        check_username = session.query(db.User).filter_by(username=username).first()
        check_email = session.query(db.User).filter_by(email=email).first()
        if check_username != None:
            abort(409, 'Username Taken')
        if check_email != None:
            abort(410, 'Email Taken')
        key = os.urandom(24)
        password_bytes = password.encode()
        hash_password = hashlib.sha256(key + password_bytes).hexdigest()
        new_user = db.User(username=username,
                           password=hash_password,
                           email=email,
                           phone=phone,
                           avatar=base_img_url+avatar,
                           token='',
                           key=key)
        session.add(new_user)
        from run import app
        send_register_email(app, username, email)
        session.commit()
        session.close()
        return { 'message': 'success' }


    



