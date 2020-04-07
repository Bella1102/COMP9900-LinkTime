from flask import request
from flask_restplus import Namespace, Resource

import db.init_db as db
from utils.helpers import *
from utils.models import auth_details, update_userInfo
home = Namespace('home', description='')

@home.route('/')
class Property(Resource):

    @home.response(200, 'Success')
    @home.doc(description='''Get all property information.''')
    def get(self):
        session = db.get_session()
        all_add_info = session.query(db.Address).all()
        states = set()
        state_suburb = {}
        # get all state into states
        for i in all_add_info:
            states.add(i.state)
        # according every state get all suburb
        for st in list(states):
            temp_sub = set()
            for item in all_add_info:
                if item.state == st:
                    temp_sub.add(item.suburb)
            state_suburb[st] = list(temp_sub)

        pro_info = session.query(db.Property).all()
        res=[]
        # res['state']=state_suburb
        res.append({"state":state_suburb})

        ran_num = random.sample(range(1, 231), 12)
        for num in ran_num:
            i = pro_info[num]
            add_info = session.query(db.Address).filter_by(property_id=i.property_id).first()
            img_info = session.query(db.Image).filter_by(property_id=i.property_id).first()
            img_list=img_info.img_url[1:-1].split(', ')
            img_list = [ele[1:-1] for ele in img_list]
            res.append({
                "property_id":i.property_id,
                "title": i.title,
                "price": i.price,
                "location": add_info.location,
                "image": img_list
            })

        session.close()
        return res







