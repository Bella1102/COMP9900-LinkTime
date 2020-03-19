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

def search_res(pro_obj, img_obj, add_obj):
    img_list = img_obj.img_url[1:-1].split(', ')
    img_list = [ele[1:-1] for ele in img_list]
    temp = {
        "property_id": add_obj.property_id,
        "latitude": round(add_obj.latitude, 5),
        "longitude": round(add_obj.longitude, 5),
        "image": img_list,
        "property_type": pro_obj.property_type,
        "amenities":pro_obj.amenities.replace('"', ''),
        "price":pro_obj.price,
        "bedrooms":pro_obj.bedrooms,
        "bathrooms":pro_obj.bathrooms,
        "title":pro_obj.title
    }
    return temp


@search.route('')
class Search(Resource):

    @search.response(200, 'Success')
    @search.response(400, 'Missing Arguments')
    @search.response(403, 'Invalid Auth Token')

    @search.param('end_date', 'The end date of rent')
    @search.param('start_date', 'The start date of rent')
    @search.param('house_type', 'Apartment, Loft, House, Unit')
    @search.param('location', 'The location of rent')
    @search.doc(description="The location is required.")
    def get(self):
        [location, house_type, start_date, end_date] = get_params(request)
        session = db.get_session()
        result = []

        # one parameter location
        if location and not house_type and not start_date and not end_date:
            loc_info = session.query(db.Address).filter_by(suburb=location).all()
            for add_obj in loc_info:
                pro_obj = session.query(db.Property).filter_by(property_id=add_obj.property_id).first()
                img_obj = session.query(db.Image).filter_by(property_id=add_obj.property_id).first()
                temp = search_res(pro_obj, img_obj, add_obj)
                result.append(temp)

        # two parameters location and house_type
        if location and house_type and not start_date and not end_date:
            loc_info = session.query(db.Address).filter_by(suburb=location).all()
            for add_obj in loc_info:
                print(add_obj.property_id)
                pro_obj = session.query(db.Property).filter(
                                        db.Property.property_id==add_obj.property_id and
                                        db.Property.property_type==house_type).first()
                img_obj = session.query(db.Image).filter_by(property_id=pro_obj.property_id).first()
                temp = search_res(pro_obj, img_obj, add_obj)
                result.append(temp)
        # three parameters location start_date end_date

        #
        # if location and not house_type and start_date and end_date:
        #     pass

        session.close()
        return result






