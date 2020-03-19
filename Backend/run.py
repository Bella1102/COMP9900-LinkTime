import os
from flask import Flask
from flask_restplus import Api
from flask_cors import CORS
from flask_mail import Mail, Message

import db.init_db as db
from apis.auth import auth
from apis.user import user
from apis.home import home
from apis.host import host
from apis.order import order
from apis.search import search
from apis.request import request
from apis.review import review

# mail_settings = {
#     "MAIL_SERVER": 'smtp.gmail.com',
#     "MAIL_PORT": 587,
#     "MAIL_USE_TLS": True,
#     "MAIL_USERNAME": 'procj0926@gmail.com',
#     'MAIL_DEFAULT_SENDER': 'procj0926@gmail.com',
#     "MAIL_PASSWORD": 'cj926926'
# }

db.init_db()
app = Flask(__name__)
CORS(app)
# app.config.update(mail_settings)
# mail = Mail(app)

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
api.add_namespace(request)
api.add_namespace(review)

# msg = Message(subject="Hello",
#               recipients=["dxh1015@gmail.com"],
#               body="This is a test email I sent with Gmail and Python!")
# mail.send(msg)


if __name__ == '__main__':
    app.run(debug=True)



