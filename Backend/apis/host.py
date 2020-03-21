import os
from flask import request, send_from_directory
from flask_restplus import Namespace, Resource

import db.init_db as db
from utils.helpers import *
from utils.models import *


host = Namespace('host', description='Property Information')


@host.route('/')
class Property(Resource):

    @host.response(200, 'Success')
    @host.response(400, 'Missing Arguments')
    @host.response(403, 'Invalid Auth Token')
    @host.param('property_id', 'like "11156"')
    @host.param('img_name', 'like "11156"')
    @host.doc(description="Get property information. \n"
    "There has an exapmple output data in \"/Backend/db/one_property.json\"")
    # if the parameter is property_id. return the property information
    # if the parameter is imagename, return the image
    def get(self):
        property_id = request.args.get('property_id')
        img_name = request.args.get('img_name')
        print(property_id, img_name)
        if property_id:
            session = db.get_session()

            pro_obj = session.query(db.Property).filter_by(property_id=property_id).first()
            img_obj = session.query(db.Image).filter_by(property_id=property_id).first()
            add_obj = session.query(db.Address).filter_by(property_id=property_id).first()
            rev_obj = session.query(db.Review).filter_by(property_id=property_id).all()
            host_obj = session.query(db.Host).filter_by(property_id=property_id).first()

            return getPropertyInfo(pro_obj, img_obj, add_obj, rev_obj, host_obj)
        else:
            return send_from_directory(os.getcwd() + '/uploads',img_name)


    @host.response(200, 'Success')
    @host.response(400, 'Missing Arguments')
    @host.response(403, 'Invalid Auth Token')
    @host.expect(property_details(host))
    @host.doc(description='''Post new property.''')
    # one image is fine. many images is not working
    def post(self):
        file = request.files['img']
        filename= file.filename
        print(filename)
        if file and allowed_file(filename):
            file.save(os.path.join(os.getcwd() + '/uploads', filename))
            return 200




