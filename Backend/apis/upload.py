import os
from flask import request, send_from_directory
from flask_restplus import Namespace, Resource

import db.init_db as db
from utils.helpers import *
from utils.models import *

from werkzeug.datastructures import FileStorage



upload = Namespace('upload', description='upload images')

upload_parser = upload.parser()
upload_parser.add_argument('img', location='files', type=FileStorage, required=True)

@upload.route('/')

class Upload(Resource):
    @upload.expect(upload_parser)
    @upload.response(200, 'Success')
    @upload.response(400, 'Missing Arguments')
    @upload.response(403, 'Invalid Auth Token')

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
