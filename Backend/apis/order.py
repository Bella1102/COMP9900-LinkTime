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
        res = []
        order_info = session.query(db.Order).filter_by(user_id=userInfo.id).all()
        for order_obj in order_info:
            pro_obj = session.query(db.Property).filter_by(property_id=order_obj.property_id).first()
            img_obj = session.query(db.Image).filter_by(property_id=order_obj.property_id).first()
            add_obj = session.query(db.Address).filter_by(property_id=order_obj.property_id).first()
            res.append(getOrderInfo(order_obj, pro_obj, img_obj, add_obj))
        return res


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
                             order_status="Active",
                             comment_status=False)

        available_dates_list = proInfo.available_dates.split(',')
        order_dates_list = dateRange(checkIn, checkOut)
        available_dates = [item for item in available_dates_list if item not in order_dates_list]

        proInfo.start_time = getTimeStamp(checkOut)
        proInfo.available_dates = ','.join(available_dates)

        session.add(new_order)
        from run import app
        send_order_email(app, userInfo.username,property_id, checkIn, checkOut, order_time, userInfo.email)
        session.commit()
        session.close()
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

        available_dates_list = proInfo.available_dates.split(',')
        order_dates_list = dateRange(orderInfo.checkIn, orderInfo.checkOut)
        available_dates = available_dates_list + order_dates_list

        orderInfo.order_status = 'Canceled'
        proInfo.start_time = round(time.mktime(datetime.date.today().timetuple()))
        proInfo.available_dates = ','.join(available_dates)

        session.commit()
        session.close()
        return { 'message': 'success'}



