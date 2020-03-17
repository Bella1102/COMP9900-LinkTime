from flask import request
from flask_restplus import Namespace, Resource

import db.init_db as db
from utils.helpers import *


request = Namespace('request', description='Visitor request')

@request.route('/')
class Search(Resource):

    @request.response(200, 'Success')
    @request.response(400, 'Missing Arguments')
    @request.response(403, 'Invalid Auth Token')
    @request.doc(description='''Personal orders!''')
    def get(self):
        pass

    @request.response(200, 'Success')
    @request.response(400, 'Missing Arguments')
    @request.response(403, 'Invalid Auth Token')
    @request.doc(description='''Personal orders!''')
    def post(self):
        pass

