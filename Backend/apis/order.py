from flask import request
from flask_restplus import Namespace, Resource

import db.init_db as db
from utils.helpers import *


order = Namespace('order', description='My orders')

@order.route('/')
class Search(Resource):

    @order.response(200, 'Success')
    @order.response(400, 'Missing Arguments')
    @order.response(403, 'Invalid Auth Token')
    @order.doc(description='''Personal orders!''')
    def get(self):
        pass


    @order.response(200, 'Success')
    @order.response(400, 'Missing Arguments')
    @order.response(403, 'Invalid Auth Token')
    @order.doc(description='''Personal orders!''')
    def post(self):
        pass


    @order.response(200, 'Success')
    @order.response(400, 'Missing Arguments')
    @order.response(403, 'Invalid Auth Token')
    @order.doc(description='''Personal orders!''')
    def delete(self):
        pass