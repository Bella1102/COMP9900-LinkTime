from flask import request
from flask_restplus import Namespace, Resource

import db.init_db as db
from utils.helpers import *
from utils.models import *


review = Namespace('review', description='Property review')

@review.route('/')
class Property(Resource):

    @review.response(200, 'Success')
    @review.response(400, 'Missing Arguments')
    @review.response(403, 'Invalid Auth Token')
    @review.doc(description='''Get property all reviews.''')
    def get(self):
        pass

    @review.response(200, 'Success')
    @review.response(400, 'Missing Arguments')
    @review.response(403, 'Invalid Auth Token')
    @review.expect(auth_details(review), review_details(review))
    @review.doc(description='''Get property all reviews.''')
    def post(self):
        session = db.get_session()
        userInfo = authorize(request)
        pass