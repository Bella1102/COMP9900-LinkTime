from flask import request
from flask_restplus import Namespace, Resource

import db.init_db as db
from utils.helpers import *
from utils.models import property_details


api = Namespace('property', description='Property Information')

@api.route('/details')
class Property(Resource):

    @api.response(200, 'Success')
    @api.response(400, 'Missing Arguments')
    @api.response(403, 'Invalid Auth Token')
    @api.expect(property_details(api))
    @api.param('property_id','the id of the property')
    @api.doc(description='''Get property information.''')
    def get(self):
        property = authorize(request)
        property_id = request.args.get('property_id', None)
        if (property_id is not None):
            session = db.get_session()
            property = session.query(db.Property).filter_by(id = property_id).first()
            session.close()
        return {
            'property_id': property.id
        }



