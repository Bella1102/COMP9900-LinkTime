import os
from flask import request, send_from_directory
from flask_restplus import Namespace, Resource

import db.init_db as db
from utils.helpers import *
from utils.models import *

from werkzeug.datastructures import FileStorage



upload = Namespace('upload', description='upload images')

upload_parser = upload.parser()
upload_parser.add_argument('property_id', location='headers',  required=True)
upload_parser.add_argument('img1', location='files', type=FileStorage, required=True)
upload_parser.add_argument('img2', location='files', type=FileStorage, required=False)
upload_parser.add_argument('img3', location='files', type=FileStorage, required=False)

@upload.route('/')

class Upload(Resource):
    @upload.param('property_id', 'like "11156"')
    @upload.expect(upload_parser)
    @upload.response(200, 'Success')
    @upload.response(400, 'Missing Arguments')
    @upload.response(403, 'Invalid Auth Token')
    @upload.doc(description="You can post many images, but flow the formular\n"
                            "img1, img2, img3...")
    def post(self):
        if not request.args:
            abort(400, 'Malformed Request')

        if not request.files:
            abort(403, 'Missing image')

        imgs_name = ['img'+ str(i) for i in range(1, 20)]
        imgs_len = len(request.files)
        property_id = request.args['property_id']

        img_alt = ['' for i in range(imgs_len)]
        img_url = []
        for i in imgs_name[:imgs_len]:
            file = request.files[i]
            filename = file.filename
            if allowed_file(filename):
                path = os.path.join(os.getcwd() + '/uploads', filename)
                img_url.append(path)
                if not os.path.exists(path):
                    file.save(path)

        session = db.get_session()
        new_imgs = db.Image(property_id=property_id, img_alt=str(img_alt), img_url=str(img_url))

        session.add(new_imgs)
        session.commit()
        session.close()

        return {'upload': 'success'}
