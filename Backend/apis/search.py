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
        if location and not house_type and not start_date and not end_date:
            loc_info = session.query(db.Address).filter_by(suburb="Potts Point").all()

        result = []
        for i in loc_info:

            one_pro_info = session.query(db.Property).filter_by(property_id=i.property_id).first()
            one_img_info = session.query(db.Image).filter_by(property_id=i.property_id).first()
            # one_img_list = one_img_info.img_url[1:-1].split(', ')
            # one_img_list = [ele[1:-1] for ele in one_img_list]
            # temp = {
            #     "property_id": i.property_id,
            #     "latitude":round(i.latitude, 5),
            #     "longitude": round(i.longitude, 5),
            #     "image":one_img_list,
            #     "property_type": one_pro_info.property_type,
            #     "amenities":one_pro_info.amenities.replace('"', ''),
            #     "price":one_pro_info.price,
            #     "bedrooms":one_pro_info.bedrooms,
            #     "bathrooms":one_pro_info.bathrooms,
            #     "title":one_pro_info.title
            #     }
            # print(temp)
            # pro_obj, img_obj, add_obj
            temp = search_res(one_pro_info,one_img_info, i)
            result.append(temp)
        session.close()
        return result
