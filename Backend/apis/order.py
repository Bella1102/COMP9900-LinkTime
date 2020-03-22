from flask import request
from flask_restplus import Namespace, Resource

import db.init_db as db
from utils.helpers import *
from utils.models import *

order = Namespace('order', description='My orders')

@order.route('/')
class Order(Resource):

    @order.response(200, 'Success')
    @order.response(400, 'Missing Arguments')
    @order.response(403, 'Invalid Auth Token')

    @order.doc(description='''Personal orders!''')
    def get(self):
        pass


    @order.response(200, 'Success')
    @order.response(400, 'Missing Arguments')
    @order.response(403, 'Invalid Auth Token')
    @order.expect(order_details(order))
    @order.doc(description='''Personal orders!''')
    def post(self):
        session = db.get_session()

        if not request.json:
            abort(400, 'Malformed Request')

        order_info = (token, property_id, checkIn, checkOut, guests) = unpack(request.json, 'token', 'property_id', 'checkIn', 'checkOut', 'guests')
        userInfo = session.query(db.User).filter_by(token=token).first()
        print(order_info)
        if not userInfo:
            abort(403, 'Invalid Auth Token')

        if '' in order_info:
            abort(400, 'Missing Arguments')

        order_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        new_order = db.Order(user_id=userInfo.id,
                             property_id=property_id,
                             order_time=order_time,
                             checkIn=checkIn,
                             checkOut=checkOut,
                             guests=guests,
                             order_status=1)
        session.add(new_order)
        session.commit()
        session.close()

        return 200

    @order.response(200, 'Success')
    @order.response(400, 'Missing Arguments')
    @order.response(403, 'Invalid Auth Token')
    @order.doc(description='''Personal orders!''')
    def delete(self):
        pass