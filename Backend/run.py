from flask import Flask
from flask_restplus import Api
from flask_cors import CORS

import db.init_db as db
from apis.auth import api as auth
from apis.user import api as user
from apis.property import api as property


db.init_db()

app = Flask(__name__)
CORS(app)

api = Api(
    app,
    version='1.0',
    title='ACCOMMODATION API',
    description='Accommodation System Backend'
)

api.add_namespace(auth)
api.add_namespace(user)
api.add_namespace(property)


if __name__ == '__main__':
    app.run(debug=True)