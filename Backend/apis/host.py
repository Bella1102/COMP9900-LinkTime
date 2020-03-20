from flask import request
from flask_restplus import Namespace, Resource

import db.init_db as db
from utils.helpers import *


host = Namespace('host', description='Property Information')



@host.route('/')
class Property(Resource):

    @host.response(200, 'Success')
    @host.response(400, 'Missing Arguments')
    @host.response(403, 'Invalid Auth Token')
    @host.param('property_id', 'like "11156"')
    @host.doc(description="Get property information. \n"
    "There has an exapmple output data in \"/Backend/db/one_property.json\"")
    def get(self):
        property_id = request.args.get('property_id')
        session = db.get_session()

        pro_obj = session.query(db.Property).filter_by(property_id=property_id).first()
        img_obj = session.query(db.Image).filter_by(property_id=property_id).first()
        add_obj = session.query(db.Address).filter_by(property_id=property_id).first()
        rev_obj = session.query(db.Review).filter_by(property_id=property_id).all()
        host_obj = session.query(db.Host).filter_by(property_id=property_id).first()

        return getPropertyInfo(pro_obj, img_obj, add_obj, rev_obj, host_obj)




    @host.response(200, 'Success')
    @host.response(400, 'Missing Arguments')
    @host.response(403, 'Invalid Auth Token')
    @host.doc(description='''Post new property.''')
    def post(self):
        pass



