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
    @search.param('location', 'The location of rent')
    @search.doc(description="The location is required.")
    def get(self):
        [location, house_type, start_date, end_date] = get_params(request)
        session = db.get_session()
        if location and not house_type and not start_date and not end_date:
            loc_info = session.query(db.Address).filter_by(suburb="Potts Point").all()

        for i in loc_info:
            print(i.property_id)
        session.close()
        return [location, house_type, start_date, end_date]
        #