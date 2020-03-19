import secrets
from flask_restplus import abort
import db.init_db as db


def gen_token():
    token = secrets.token_hex(32)
    return token

def unpack(j, *args, **kargs):
    res = [j.get(arg, None) for arg in args]
    if kargs.get("required", True):
        [abort(kargs.get("Missing Arguments", 400)) for e in res if e == None]
    return res

def authorize(request):
    res = request.headers.get('Authorization', None)
    if not res:
        abort(403, 'Unsupplied Authorization Token')
    session = db.get_session()
    user = session.query(db.User).filter_by(token=res).first()
    session.close()
    if not user:
        abort(403, 'Invalid Authorization Token')
    return user

def getAllPropInfo(data):
    return{
        "id": data.id,
        "property_id": data.property_id,
        'title': data.title,
        'property_type': data.property_type,
        'amenities': amenities,
        'price': data.price,
        'bedrooms': data.bedrooms,
        'bathrooms': data.bathrooms,
        'accommodates': data.accommodates,
        'minimum_nights': data.minimum_nights,
        'description': data.description,
        'notes': data.notes,
        'house_rules': data.house_rules,
        'start_time': data.start_time,
        'end_time': data.end_time
    }


