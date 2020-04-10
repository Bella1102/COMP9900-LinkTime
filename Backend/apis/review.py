from flask import request
from flask_restplus import Namespace, Resource

import db.init_db as db
from utils.helpers import *
from utils.models import *


review = Namespace('review', description='Property review')

@review.route('/')
class Review(Resource):

    @review.response(200, 'Success')
    @review.response(400, 'Missing Arguments')
    @review.response(403, 'Invalid Auth Token')
    @review.expect(auth_details(review), review_details(review))
    @review.doc(description='''Get property all reviews.''')
    def post(self):
        session = db.get_session()
        userInfo = authorize(request)

        if not request.json:
            abort(400, 'Malformed Request')

        if not userInfo:
            abort(403, 'Invalid Auth Token')

        (property_id, review_content) = unpack(request.json, 'property_id', 'review_content')
        review_date = getLocalTime()

        new_review = db.Review(property_id=property_id,
                               reviewer_id=userInfo.id,
                               reviewer_name=userInfo.username,
                               review_date=review_date,
                               review_content=review_content,
                               head_picture=userInfo.avatar)


        order_info = session.query(db.Order).filter_by(user_id=userInfo.id,property_id=property_id).first()

        if order_info:
            order_info.comment_status = False

        session.add(new_review)
        session.commit()
        session.close()
        return {'message': 'success'}
