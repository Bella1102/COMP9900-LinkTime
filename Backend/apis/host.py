from flask import request
from flask_restplus import Namespace, Resource

import db.init_db as db
from utils.helpers import *


host = Namespace('host', description='Property Information')

@host.route('/')
class Property(Resource):

    @host.response(200, 'Success')
    @host.response(400, 'Missing Arguments')
    @host.response(403, 'Invalid Auth Token')
    @host.doc(description='''Get property information.''')
    def get(self):
        pass




    @host.response(200, 'Success')
    @host.response(400, 'Missing Arguments')
    @host.response(403, 'Invalid Auth Token')
    @host.doc(description='''Post new property.''')
    def post(self):
        pass



