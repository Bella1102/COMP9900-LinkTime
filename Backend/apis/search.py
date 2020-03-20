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

def change_date_to_time(str_date):
    dateTime = datetime.datetime.strptime(str_date, '%Y-%m-%d')
    return time.mktime(dateTime.timetuple())


@search.route('')
class Search(Resource):

    @search.response(200, 'Success')
    @search.response(400, 'Missing Arguments')
    @search.response(403, 'Invalid Auth Token')
    @search.param('end_date', 'end date formular: %Y-%M-%D')
    @search.param('start_date', 'start date formular: %Y-%M-%D')
    @search.param('house_type', 'Apartment, Loft, House, Unit')
    @search.param('location', '[Bondi,Pyrmont,Paddington...]')
    @search.doc(description="Search rule:\n"
                            "1. no parameters: /search\n"
                            "2. one parameters(location is required and the location need to be a suburb): /search?location=Bondi\n"
                            "3. two parameters(location and house_type): /search?location=Bondi&house_type=House\n"
                            "4. three parameters(location, start_date, end_date):/search?location=Bondi&start_date=2020-3-20&end_date=2020-3-23\n"
                            "5. four parameters(location, house_type,start_date, end_date)")
    def get(self):
        [location, house_type, start_date, end_date] = get_params(request)
        session = db.get_session()
        result = []

        if not location and not house_type and not start_date and not end_date:
            loc_info = session.query(db.Address).all()
            for add_obj in loc_info:
                pro_obj = session.query(db.Property).filter_by(property_id=add_obj.property_id).first()
                img_obj = session.query(db.Image).filter_by(property_id=add_obj.property_id).first()
                temp = searchResult(pro_obj, img_obj, add_obj)
                result.append(temp)


        # one parameter location
        elif location and not house_type and not start_date and not end_date:
            loc_info = session.query(db.Address).filter_by(suburb=location).all()
            for add_obj in loc_info:
                pro_obj = session.query(db.Property).filter_by(property_id=add_obj.property_id).first()
                img_obj = session.query(db.Image).filter_by(property_id=add_obj.property_id).first()
                temp = searchResult(pro_obj, img_obj, add_obj)
                result.append(temp)

        # two parameters location and house_type
        elif location and house_type and not start_date and not end_date:
            loc_info = session.query(db.Address).filter_by(suburb=location).all()
            for add_obj in loc_info:
                pro_obj = session.query(db.Property).filter_by(property_id=add_obj.property_id, property_type=house_type).first()
                if pro_obj:
                    img_obj = session.query(db.Image).filter_by(property_id=pro_obj.property_id).first()
                    temp = searchResult(pro_obj, img_obj, add_obj)
                    result.append(temp)

        # three parameters location start_date end_date
        elif location and not house_type and start_date and end_date:
            loc_info = session.query(db.Address).filter_by(suburb=location).all()
            second_time = change_date_to_time(start_date)

            for add_obj in loc_info:
                pro_obj = session.query(db.Property).filter(db.Property.property_id==add_obj.property_id)\
                                                    .filter(db.Property.start_time<=str(second_time)).first()
                if pro_obj:
                    img_obj = session.query(db.Image).filter_by(property_id=pro_obj.property_id).first()
                    temp = searchResult(pro_obj, img_obj, add_obj)
                    result.append(temp)

        # four parameters
        # if location and house_type and start_date and end_date:
        else:
            second_time = change_date_to_time(start_date)
            loc_info = session.query(db.Address).filter_by(suburb=location).all()
            for add_obj in loc_info:
                pro_obj = session.query(db.Property).filter(db.Property.property_id==add_obj.property_id)\
                                                    .filter(db.Property.property_type==house_type)\
                                                    .filter(db.Property.start_time<=str(second_time)).first()
                if pro_obj:
                    img_obj = session.query(db.Image).filter_by(property_id=pro_obj.property_id).first()
                    temp = searchResult(pro_obj, img_obj, add_obj)
                    result.append(temp)

        session.close()
        print(len(result))
        return result






