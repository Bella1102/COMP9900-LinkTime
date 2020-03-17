from flask import request
from flask_restplus import Namespace, Resource

import db.init_db as db
from utils.helpers import *
from utils.models import search_params


search = Namespace('search', description='Search results')

@search.route('/')
class Search(Resource):

    @search.response(200, 'Success')
    @search.response(400, 'Missing Arguments')
    @search.response(403, 'Invalid Auth Token')
    @search.expect(search_params(search))
    @search.doc(description='''Return search results.''')
    def get(self):
        pass
