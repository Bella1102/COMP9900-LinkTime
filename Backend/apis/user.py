from flask import request
from flask_restplus import Namespace, Resource

import db.init_db as db
from utils.helpers import *
from utils.models import auth_details, update_userInfo


api = Namespace('user', description='User Information')

@api.route('/')
class User(Resource):

    @api.response(200, 'Success')
    @api.response(400, 'Missing Arguments')
    @api.response(403, 'Invalid Auth Token')
    @api.expect(auth_details(api))
    @api.param('user_id','the id of the user')
    @api.doc(description='''Get user information.''')
    def get(self):
        user = authorize(request)
        user_id = request.args.get('user_id', None)
        if (user_id is not None):
            session = db.get_session()
            user = session.query(db.User).filter_by(id = user_id).first()
            session.close()
        return {
            "id": user.id,
            'username': user.username,
            'password': user.password,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
            'email': user.email,
            'telephone': user.telephone,
            'token': user.token
        }

    @api.response(200, 'Success')
    @api.response(400, 'Missing Arguments')
    @api.response(403, 'Invalid Auth Token')
    @api.expect(auth_details(api), update_userInfo(api))
    @api.doc(description='''Update user information.''')
    def put(self):
        user = authorize(request)
        # only username, password, email, telephone can be update
        (username, password, email, telephone) = unpack(request.json, 'username', 'password', 'email', 'telephone', required=False)

        if username == None and password == None and email == None:
            abort(400, 'Malformed Request')
        if username != None and username == '':
            abort(400, 'Malformed Request')
        if password != None and password == '':
            abort(400, 'Malformed Request')
        if email != None and email == '':
            abort(400, 'Malformed Request')
        if telephone != None and telephone == '':
            abort(400, 'Malformed Request')

        session = db.get_session()
        user = session.query(db.User).filter_by(token = user.token).first()

        # update information
        if username != None:
            user.username = username
        if password != None:
            user.password = password
        if email != None:
            user.email = email
        if telephone != None:
            user.telephone = telephone

        session.commit()
        session.close()
        return {
            'message': 'success'
        }

