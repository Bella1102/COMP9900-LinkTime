import os
from flask import request, send_from_directory
from flask_restplus import Namespace, Resource

import db.init_db as db
from utils.helpers import *
from utils.models import *

from werkzeug.datastructures import FileStorage



upload = Namespace('upload', description='upload images')

upload_parser = upload.parser()
upload_parser.add_argument('file', location='files', type=FileStorage, required=True)

@upload.route('/')

@upload.response(200, 'Success')
@upload.response(400, 'Missing Arguments')
@upload.response(403, 'Invalid Auth Token')
class Upload(Resource):

    @upload.param('img_name', 'like "pic.jpg"')
    def get(self):
        img_name = request.args.get('img_name')
        path = os.path.join(os.getcwd() + '/uploads', img_name)
        if os.path.exists(path):
            return send_from_directory(os.getcwd() + '/uploads', img_name)
        else:
            abort(403, 'Image not exist')

    @upload.expect(upload_parser)
    def post(self):
        if not request.files:
            abort(403, 'Missing image')

        file=request.files.to_dict()['file']
        filename = file.filename
        if allowed_file(filename):
            path = os.path.join(os.getcwd() + '/uploads', filename)
            if not os.path.exists(path):
                file.save(path)

        return {'message': 'success'}
