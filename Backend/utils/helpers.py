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
    req = request.headers.get('Authorization', None)
    if not req:
        abort(403, 'Unsupplied Authorization Token')
        
    session = db.get_session()
    user = session.query(db.User).filter_by(token = req).first()
    session.close()
    if not user:
        abort(403, 'Invalid Authorization Token')
    return user