from flask import Flask
from flask_restplus import Api
from flask_cors import CORS



import db.init_db as db
from apis.auth import auth
from apis.user import user
from apis.home import home
from apis.host import host
from apis.order import order
from apis.search import search
from apis.requests import requests
from apis.review import review
from apis.upload import upload
import utils.helpers
from dotenv import load_dotenv


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
api.add_namespace(home)
api.add_namespace(host)
api.add_namespace(order)
api.add_namespace(search)
api.add_namespace(requests)
api.add_namespace(review)
api.add_namespace(upload)



if __name__ == '__main__':
    load_dotenv()
    app.run(debug=True)



