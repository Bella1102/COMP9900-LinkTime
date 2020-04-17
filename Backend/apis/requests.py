from flask import request
from flask_restplus import Namespace, Resource

import db.init_db as db
from utils.helpers import *
from utils.models import *


requests = Namespace('requests', description='Visitor request')

@requests.route('/')
class Requests(Resource):

    @requests.response(200, 'Success')
    @requests.doc(description='''Personal orders!''')
    def get(self):
        session = db.get_session()
        all_requests = session.query(db.Request).all()
        res = []
        for req_obj in all_requests:
            com_info = session.query(db.Comment).filter_by(request_id=req_obj.id).all()
            comments = getCommentsOneRequest(com_info)
            temp = {'req_id': req_obj.id,
                    'user_name': req_obj.user_name,
                    'avatar': req_obj.avatar,
                    'request_title': req_obj.request_title,
                    'request_content': req_obj.request_content,
                    'request_time': req_obj.request_time,
                    'comments': comments}

            res.append(temp)

        session.close()
        res.sort(key=lambda x: x['request_time'], reverse=True)
        return res

    @requests.response(200, 'Success')
    @requests.response(400, 'Missing Arguments')
    @requests.response(403, 'Invalid Auth Token')
    @requests.expect(auth_details(requests), requests_details(requests))
    @requests.doc(description='''All requests!''')
    def post(self):
        session = db.get_session()

        if not request.json:
            abort(400, 'Malformed Request')

        userInfo = authorize(request)

        if not userInfo:
            abort(403, 'Invalid Auth Token')

        (request_title, request_content) = unpack(request.json, 'request_title', 'request_content')

        request_time = getLocalTime()

        new_request = db.Request(user_name=userInfo.username,
                                 user_id=userInfo.id,
                                 avatar=userInfo.avatar,
                                 request_title=request_title,
                                 request_content=request_content,
                                 request_time=request_time)
        session.add(new_request)
        session.commit()
        session.close()
        return {'message': 'success'}

    @requests.response(200, 'Success')
    @requests.response(400, 'Missing Arguments')
    @requests.response(403, 'Invalid Auth Token')
    @requests.response(405, 'Invalid Request Id')
    @requests.expect(auth_details(requests))
    @requests.param('req_id', '1')
    def delete(self):
        session = db.get_session()

        if not request.args:
            abort(400, 'Missing Arguments')

        userInfo = authorize(request)

        if not userInfo:
            abort(403, 'Invalid Auth Token')

        req_id = request.args.get('req_id')
        req_obj = session.query(db.Request).filter_by(id=req_id, user_id=userInfo.id).first()

        if not req_obj:
            abort(405, 'Invalid Request Id')
        else:
            session.delete(req_obj)
            session.commit()
        session.close()
        return {'message': 'success'}


@requests.route('/comment')
@requests.response(200, 'Success')
@requests.response(400, 'Missing Arguments')
@requests.response(403, 'Invalid Auth Token')
class Comment(Resource):

    @requests.response(405, 'Invalid Request Id')
    @requests.expect(auth_details(requests), comment_request_details(requests))
    @requests.param('req_id', '1')
    def post(self):
        session = db.get_session()

        if not request.json or not request.args:
            abort(400, 'Missing Arguments')

        userInfo = authorize(request)

        if not userInfo:
            abort(403, 'Invalid Auth Token')

        request_id = request.args.get('req_id')
        [comment_content] = unpack(request.json, 'comment_content')
        req_info = session.query(db.Request).filter_by(id=request_id).first()

        if not req_info:
            abort(405, 'Invalid Request Id')

        new_comment = db.Comment(request_id=request_id,
                                 commenter_id=userInfo.id,
                                 commenter_name=userInfo.username,
                                 commenter_avatar=userInfo.avatar,
                                 comment_content=comment_content,
                                 comment_time=getLocalTime())
        session.add(new_comment)
        session.commit()
        session.close()
        return {'message': 'success'}


    @requests.expect(auth_details(requests))
    @requests.param('comment_id', '1')
    def delete(self):
        session = db.get_session()
        if not request.args:
            abort(400, 'Missing Arguments')

        userInfo = authorize(request)

        if not userInfo:
            abort(403, 'Invalid Auth Token')

        comment_id = request.args.get('comment_id')

        new_comment = session.query(db.Comment).filter_by(id=comment_id, commenter_id=userInfo.id).first()

        if not new_comment:
            abort(405, 'Invalid Comment Id')
        else:
            session.delete(new_comment)
            session.commit()
        session.close()
        return {'message': 'success'}


