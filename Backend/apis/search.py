import time
import datetime
from flask import request
from flask_restplus import Namespace, Resource

import db.init_db as db
from utils.helpers import *
from utils.models import search_params

search = Namespace('search', description='Search results')


def get_params(r):
    location = r.args.get('location')
    house_type = r.args.get('house_type')
    start_date = r.args.get('start_date')
    end_date = r.args.get('end_date')
    return [location, house_type, start_date, end_date]

@search.route('')
class Search(Resource):

    @search.response(200, 'Success')
    @search.response(400, 'Missing Arguments')
    @search.response(403, 'Invalid Auth Token')
    @search.param('end_date', 'The end date of rent')
    @search.param('start_date', 'The start date of rent')
    @search.param('house_type', 'Apartment, Loft, House, Unit')
    @search.param('location', '[Bondi,Pyrmont,Paddington...]')
    @search.doc(description="Search rule:\n"
                            "1. no parameters\n"
                            "2. one parameters(house_type)\n"
                            "3. one parameters(location is required and the location need to be a suburb): \n"
                            "4. two parameters(start_date and end date): " 
                            "5. two parameters(location and house_type):\n"
                            "6. three parameters(location, start_date, end_date)\n"
                            "7. three parameters(house_type, start_date, end_date)"
                            "8. four parameters(location, house_type,start_date, end_date)")
    def get(self):
        [location, house_type, start_date, end_date] = get_params(request)
        session = db.get_session()
        result = []

        #1. no parameter
        if not location and not house_type and not start_date and not end_date:
            loc_info = session.query(db.Address).all()
            for add_obj in loc_info:
                pro_obj = session.query(db.Property).filter_by(property_id=add_obj.property_id).first()
                img_obj = session.query(db.Image).filter_by(property_id=add_obj.property_id).first()
                temp = searchResult(pro_obj, img_obj, add_obj)
                result.append(temp)

        #2. one parameter house_type
        if not location and house_type and not start_date and not end_date:
            pro_info = session.query(db.Property).filter_by(property_type=house_type).all()
            for pro_obj in pro_info:
                img_obj = session.query(db.Image).filter_by(property_id=pro_obj.property_id).first()
                add_obj = session.query(db.Address).filter_by(property_id=pro_obj.property_id).first()
                temp = searchResult(pro_obj, img_obj, add_obj)
                result.append(temp)

        #3.one parameter location
        if location and not house_type and not start_date and not end_date:
            loc_info = session.query(db.Address).filter_by(suburb=location).all()
            for add_obj in loc_info:
                pro_obj = session.query(db.Property).filter_by(property_id=add_obj.property_id).first()
                img_obj = session.query(db.Image).filter_by(property_id=add_obj.property_id).first()
                temp = searchResult(pro_obj, img_obj, add_obj)
                result.append(temp)

        #4.two parameters start_date and end_date
        if not location and not house_type and start_date and end_date:
            second_time = getTimeStamp(end_date)
            pro_info = session.query(db.Property).all()
            order_dates_list = dateRange(start_date, end_date)
            order_str = ','.join(order_dates_list)
            for pro_obj in pro_info:
                if order_str in pro_obj.available_dates:
                    img_obj = session.query(db.Image).filter_by(property_id=pro_obj.property_id).first()
                    add_obj = session.query(db.Address).filter_by(property_id=pro_obj.property_id).first()
                    temp = searchResult(pro_obj, img_obj, add_obj)
                    result.append(temp)

        #5.two parameters location and house_type
        if location and house_type and not start_date and not end_date:
            loc_info = session.query(db.Address).filter_by(suburb=location).all()
            for add_obj in loc_info:
                pro_obj = session.query(db.Property).filter_by(property_id=add_obj.property_id, property_type=house_type).first()
                if pro_obj:
                    img_obj = session.query(db.Image).filter_by(property_id=pro_obj.property_id).first()
                    temp = searchResult(pro_obj, img_obj, add_obj)
                    result.append(temp)

        #6.three parameters location start_date end_date
        if location and not house_type and start_date and end_date:
            loc_info = session.query(db.Address).filter_by(suburb=location).all()
            second_time = getTimeStamp(start_date)
            for add_obj in loc_info:
                pro_obj = session.query(db.Property).filter(db.Property.property_id==add_obj.property_id).first()
                order_dates_list = dateRange(start_date, end_date)
                order_str = ','.join(order_dates_list)
                if order_str in pro_obj.available_dates:
                    img_obj = session.query(db.Image).filter_by(property_id=pro_obj.property_id).first()
                    temp = searchResult(pro_obj, img_obj, add_obj)
                    result.append(temp)

        #7.three parameters house_type start_date end_date
        if not location and house_type and start_date and end_date:
            pro_info = session.query(db.Property).filter_by(property_type=house_type).all()
            for pro_obj in pro_info:
                order_dates_list = dateRange(start_date, end_date)
                order_str = ','.join(order_dates_list)
                if order_str in pro_obj.available_dates:
                    img_obj = session.query(db.Image).filter_by(property_id=pro_obj.property_id).first()
                    add_obj = session.query(db.Address).filter_by(property_id=pro_obj.property_id).first()
                    temp = searchResult(pro_obj, img_obj, add_obj)
                    result.append(temp)

        #8.four parameters
        if location and house_type and start_date and end_date:
            second_time = getTimeStamp(start_date)
            loc_info = session.query(db.Address).filter_by(suburb=location).all()
            for add_obj in loc_info:
                order_dates_list = dateRange(start_date, end_date)
                order_str = ','.join(order_dates_list)
                pro_obj = session.query(db.Property).filter(db.Property.property_id==add_obj.property_id)\
                                                    .filter(db.Property.property_type==house_type).first()
                if order_str in pro_obj.available_dates:
                    img_obj = session.query(db.Image).filter_by(property_id=pro_obj.property_id).first()
                    temp = searchResult(pro_obj, img_obj, add_obj)
                    result.append(temp)

        session.close()
        print(len(result))
        return result






