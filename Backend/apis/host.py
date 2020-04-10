from flask import request
from flask_restplus import Namespace, Resource

import db.init_db as db
from utils.helpers import *
from utils.models import *



host = Namespace('host', description='Property Information')


@host.route('/')
class Property(Resource):

    @host.response(200, 'Success')
    @host.response(400, 'Missing Arguments')
    @host.response(403, 'Invalid Auth Token')
    @host.param('property_id', 'like "11156"')
    @host.param('property_id', 'like "11156"')
    @host.doc(description="Get property information. \n"
    "There has an exapmple output data in \"/Backend/db/one_property.json\"")

    def get(self):
        property_id = request.args.get('property_id')
        session = db.get_session()

        pro_obj = session.query(db.Property).filter_by(property_id=property_id).first()
        img_obj = session.query(db.Image).filter_by(property_id=property_id).first()
        add_obj = session.query(db.Address).filter_by(property_id=property_id).first()
        rev_obj = session.query(db.Review).filter_by(property_id=property_id).all()
        host_obj = session.query(db.Host).filter_by(property_id=property_id).first()

        session.close()
        return getPropertyInfo(pro_obj, img_obj, add_obj, rev_obj, host_obj)



    @host.response(200, 'Success')
    @host.response(400, 'Missing Arguments')
    @host.response(403, 'Invalid Auth Token')
    @host.expect(auth_details(host), property_details(host))
    @host.doc(description="Post new property. Notice: through the upload API upload images,\n"
                            "and then put the img name into the filename list")
    def post(self):
        session = db.get_session()

        if not request.json:
            abort(400, 'Malformed Request')

        post_pro_info = (title,
                         property_type,
                         amenities,
                         price,
                         state,
                         suburb,
                         location,
                         postcode,
                         bedrooms,
                         bathrooms,
                         accommodates,
                         start_time,
                         end_time,
                         filename,
                         description,
                         house_rules)= unpack(request.json,\
                                              'title',
                                              'type',
                                              'amenities',
                                              'price',
                                              'state',
                                              'suburb',
                                              'location',
                                              'postcode',
                                              'bedrooms',
                                              'bathrooms',
                                              'accommodates',
                                              'start_date',
                                              'end_date',
                                              'filename',
                                              'other_details',
                                              'house_rules')

        userInfo = authorize(request)

        if not userInfo:
            abort(403, 'Invalid Auth Token')

        # because description is not required
        if '' in post_pro_info[:-2]:
            abort(400, 'Missing Arguments')

        property_id = generatePropertyId()
        [latitude, longitude] = getLatLng(state, suburb, location, )
        new_property = db.Property(property_id=property_id,
                                   title=title,
                                   property_type=property_type,
                                   amenities=amenities,
                                   price=price,
                                   bedrooms=bedrooms,
                                   bathrooms=bathrooms,
                                   accommodates=accommodates,
                                   minimum_nights=1,
                                   description=description,
                                   notes='',
                                   house_rules=house_rules,
                                   start_time=getTimeStamp(start_time),
                                   end_time=getTimeStamp(end_time),
                                   available_dates=','.join(dateRange(start_time, end_time)))

        new_address = db.Address(property_id=property_id,
                                 state=state,
                                 suburb=suburb,
                                 location= '%s, %s, %s' % (location, suburb, state),
                                 latitude=latitude,
                                 longitude=longitude)

        new_host = db.Host(property_id=property_id,
                           host_id=userInfo.id,
                           host_name=userInfo.username,
                           host_img_url=userInfo.avatar,
                           host_verifications="['email', 'phone', 'reviews']")

        imgs_num = len(filename)
        img_alt = ['' for i in range(imgs_num)]
        img_url = [base_img_url + item for item in filename]
        new_imgs =  db.Image(property_id=property_id, img_alt=str(img_alt), img_url=str(img_url))

        session.add(new_property)
        session.add(new_address)
        session.add(new_host)
        session.add(new_imgs)
        session.commit()
        session.close()
        return {'Property id': property_id}

    @host.response(200, 'Success')
    @host.response(400, 'Missing Arguments')
    @host.response(403, 'Invalid Auth Token')
    @host.response(405, 'Invalid property_id')
    @host.expect(auth_details(host))
    @host.param('property_id', 'like "11156"')
    @host.doc(description='Delete your property')
    def delete(self):
        session = db.get_session()

        if not request.args:
            abort(400, 'Missing Arguments')

        userInfo = authorize(request)

        if not userInfo:
            abort(403, 'Invalid Auth Token')

        property_id = request.args.get('property_id')

        host_obj = session.query(db.Host).filter_by(property_id=property_id, host_id=userInfo.id).first()

        if not host_obj:
            abort(405, 'Invalid property_id')
        else:
            pro_obj = session.query(db.Property).filter_by(property_id=property_id).first()
            add_obj = session.query(db.Address).filter_by(property_id=property_id).first()

            session.delete(pro_obj)
            session.delete(add_obj)
            session.delete(host_obj)

            session.commit()

        session.close()
        return {'message': 'success'}

    @host.response(200, 'Success')
    @host.response(400, 'Missing Arguments')
    @host.response(403, 'Invalid Auth Token')
    @host.response(405, 'Invalid property_id')
    @host.param('property_id', 'like "11156"', required=True)
    @host.expect(auth_details(host), update_property_details(host))
    def put(self):
        session = db.get_session()

        if not request.args:
            abort(400, 'Missing Arguments')

        userInfo = authorize(request)

        if not userInfo:
            abort(403, 'Invalid Auth Token')

        property_id = request.args.get('property_id')
        host_obj = session.query(db.Host).filter_by(property_id=property_id, host_id=userInfo.id).first()

        if not host_obj:
            abort(405, 'Invalid property_id')
        else:
            (title, amenities, price, start_time, end_time, filename, description, house_rules) = unpack(request.json, \
            'title', 'amenities', 'price', 'start_date','end_date', 'filename', 'other_details', 'house_rules')

            pro_obj = session.query(db.Property).filter_by(property_id=property_id).first()
            img_obj = session.query(db.Image).filter_by(property_id=property_id).first()

            if title: pro_obj.title = title
            if amenities != '{}': pro_obj.amenities = amenities
            if price: pro_obj.price = price
            if start_time: pro_obj.start_time = getTimeStamp(start_time)
            if end_time: pro_obj.end_time=getTimeStamp(end_time)
            if description: pro_obj.description = description
            if house_rules: pro_obj.house_rules = house_rules
            if start_time and not end_time: pro_obj.available_dates = ','.join(dateRange(start_time, end_time))
            if filename:
                img_url_list = changeTextToList(img_obj.img_url)
                img_alt_list = changeTextToList(img_obj.img_alt)
                imgs_num = len(filename)
                img_alt_list.extend(['' for i in range(imgs_num)])
                img_url_list.extend([base_img_url + item for item in filename])
                img_obj.img_alt = str(img_alt_list)
                img_obj.img_url = str(img_url_list)

            session.commit()

        session.close()
        return {'message': 'success'}





