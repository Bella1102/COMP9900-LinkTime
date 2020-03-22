from flask import request
from flask_restplus import Namespace, Resource
import datetime
from utils.helpers import *
from utils.models import *

order = Namespace('order', description='My orders')

@order.route('/')
class Order(Resource):

    @order.response(200, 'Success')
    @order.response(400, 'Missing Arguments')
    @order.response(403, 'Invalid Auth Token')
    @order.expect(auth_details(order))
    @order.doc(description='''Personal orders!''')
    def get(self):
        session = db.get_session()
        userInfo = authorize(request)
        if not userInfo:
            abort(403, 'Invalid Auth Token')

        order_info = session.query(db.Order).filter_by(user_id=userInfo.id).all()
        print(order_info)
        return getOrderInfo(order_info)


    @order.response(200, 'Success')
    @order.response(400, 'Missing Arguments')
    @order.response(403, 'Invalid Auth Token')
    @order.response(409, 'Invalid property_id')
    @order.expect(auth_details(order), order_details(order))
    @order.doc(description='''Personal orders!''')
    def post(self):
        session = db.get_session()

        if not request.json:
            abort(400, 'Malformed Request')

        order_info = (property_id, checkIn, checkOut, guests) = unpack(request.json, 'property_id', 'checkIn', 'checkOut', 'guests')
        userInfo = authorize(request)
        proInfo = session.query(db.Property).filter_by(property_id=property_id).first()

        if not userInfo:
            abort(403, 'Invalid Auth Token')

        if '' in order_info:
            abort(400, 'Missing Arguments')

        if not proInfo:
            abort(409, 'Invalid property_id')

        order_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        new_order = db.Order(user_id=userInfo.id,
                             property_id=property_id,
                             order_time=order_time,
                             checkIn=checkIn,
                             checkOut=checkOut,
                             guests=guests,
                             order_status="Activate")
        proInfo.start_time = getTimeStamp(checkOut)
        session.add(new_order)
        session.commit()
        session.close()
        print(checkOut)
        return {'message': 'success'}

    @order.response(200, 'Success')
    @order.response(400, 'Invalid order_id(User and Order do not match)')
    @order.response(403, 'Invalid Auth Token')
    @order.expect(auth_details(order))
    @order.param('order_id', 'the order id')
    @order.doc(description='''Personal orders!''')
    def delete(self):
        session = db.get_session()
        order_id = request.args.get('order_id', None)
        userInfo = authorize(request)
        orderInfo = session.query(db.Order).filter_by(id=order_id, user_id=userInfo.id).first()

        if not userInfo:
            abort(403, 'Invalid Auth Token')
        if not orderInfo:
            abort(400, 'Invalid order_id')

        proInfo = session.query(db.Property).filter_by(property_id=orderInfo.property_id).first()

        orderInfo.order_status='Cancel'
        proInfo.start_time=round(time.mktime(datetime.date.today().timetuple()))

        session.commit()
        session.close()

        return { 'message': 'success'}



