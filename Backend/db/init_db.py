import os
import hashlib
import json
import time
import datetime
import pandas as pd
from sqlalchemy import *
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from utils.helpers import *


engine = create_engine('sqlite:///db/dataBase.db?check_same_thread=False', echo = False)
Base = declarative_base()


# 1
class User(Base):
    __table__ = Table('User',
                        Base.metadata,
                        Column('id', Integer, primary_key=True),
                        Column('username', VARCHAR(20), unique=True),
                        Column('password', VARCHAR(20)),
                        Column('email', VARCHAR(20), unique=True),
                        Column('phone', VARCHAR(20)),
                        Column('avatar', Text),
                        Column('token', VARCHAR(64)),
                        Column('key', VARCHAR(64)))

    def __repr__(self):
        return 'User:\nUsername: %s\nEmail: %s' % (self.username, self.email)

# 2
class Property(Base):
    __table__ = Table('Property',
                        Base.metadata,
                        Column('id', Integer, primary_key=True),
                        Column('property_id', Integer, unique=True),
                        Column('title', Text),
                        Column('property_type', VARCHAR(30)),
                        Column('amenities', Text),
                        Column('price', VARCHAR(20)),
                        Column('bedrooms', Integer),
                        Column('bathrooms', Float),
                        Column('accommodates', Integer),
                        Column('minimum_nights', Integer),
                        Column('description', Text),
                        Column('notes', Text),
                        Column('house_rules', Text),
                        Column('start_time', Integer),
                        Column('end_time', Integer),
                        Column('available_dates', Text))
    def __repr__(self):
        # return 'This is Property table'
        return 'Property: %s' % (self.property_id)

# 3
class Host(Base):
    __table__ = Table('Host',
                        Base.metadata,
                        Column('id', Integer, primary_key=True),
                        Column('property_id', Integer),
                        Column('host_id', Integer),
                        Column('host_name', VARCHAR(20)),
                        Column('host_img_url', Text),
                        Column('host_verifications', Text))
    def __repr__(self):
        return 'Host: %s' % (self.property_id)

# 4
class Address(Base):
    __table__ = Table('Address',
                        Base.metadata,
                        Column('id', Integer, primary_key=True),
                        Column('property_id', Integer),
                        Column('country', VARCHAR(20)),
                        Column('state', VARCHAR(20)),
                        Column('city', VARCHAR(20)),
                        Column('suburb', VARCHAR(50)),
                        Column('location', VARCHAR(50)),
                        Column('postcode', Integer),
                        Column('latitude', Float),
                        Column('longitude', Float))
    def __repr__(self):
        return 'Address: %s' % (self.property_id)

# 5
class Image(Base):
    __table__ = Table('Image',
                        Base.metadata,
                        Column('id', Integer, primary_key=True),
                        Column('property_id', Integer),
                        Column('img_url', Text),
                        Column('img_alt', Text))
    def __repr__(self):
        return 'Image: %s' % (self.property_id)

# 6
class Review(Base):
    __table__ = Table('Review',
                        Base.metadata,
                        Column('id', Integer, primary_key=True),
                        Column('property_id', Integer),
                        Column('reviewer_id', Integer),
                        Column('reviewer_name',  VARCHAR(20)),
                        Column('review_date', VARCHAR(20)),
                        Column('review_content', Text),
                        Column('head_picture', Text))
    def __repr__(self):
        return 'review: %s' % (self.property_id)

# 7
class Order(Base):
    __table__ = Table('Order',
                        Base.metadata,
                        Column('id', Integer, primary_key=True),
                        Column('user_id', Integer),
                        Column('property_id', Integer),
                        Column('order_time', VARCHAR(20)),
                        Column('checkIn', VARCHAR(20)),
                        Column('checkOut', VARCHAR(20)),
                        Column('guests', Integer),
                        Column('order_status', VARCHAR(20)),
                        Column('comment_status', Boolean))
    def __repr__(self):
        return 'Order: %s' % (self.id)

# 8
class Request(Base):
    __table__ = Table('Request',
                        Base.metadata,
                        Column('id', Integer, primary_key=True),
                        Column('user_id', Integer),
                        Column('user_name', VARCHAR(30)),
                        Column('avatar', Text),
                        Column('request_title', VARCHAR(30)),
                        Column('request_content', Text),
                        Column('request_time', Text))
    def __repr__(self):
        return 'Request: %s' % (self.id)
# 9
class Comment(Base):
    __table__ = Table('Comment',
                        Base.metadata,
                        Column('id', Integer, primary_key=True),
                        Column('request_id', Integer),
                        Column('commenter_id', Integer),
                        Column('commenter_name', VARCHAR(30)),
                        Column('commenter_avatar', Text),
                        Column('comment_content', Text),
                        Column('comment_time', Text))
    def __repr__(self):
        return 'Comment: %s' % (self.id)


def init_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    Session = sessionmaker(engine)
    session = Session()
    # init dataBase
    init_user(session)
    init_property(session)
    init_host(session)
    init_address(session)
    init_image(session)
    init_review(session)
    init_request(session)
    init_comment(session)
    init_order(session)
    # finish init
    session.close()


def get_session():
    Session = sessionmaker(engine)
    return Session()


def read_csv_return_dict(filepath):
    df = pd.read_csv(filepath)
    res = []
    for i in range(len(df)):
        temp = {}
        for j in list(df.keys()):
            temp[j] = df[j][i]
        res.append(temp)
    return res


def init_user(session):
    with open('db/data/user.csv') as f:
        for line in f.readlines():
            line = line.strip().split(',')
            key = os.urandom(24)
            password_bytes = line[1].encode()
            hash_password = hashlib.sha256(key + password_bytes).hexdigest()
            user = User(username=line[0], password=hash_password, email=line[2], phone=line[3], avatar=base_img_url+line[4], token='', key=key)
            session.add(user)
    session.commit()


# the start date is seconds of 0:0 today
def init_property(session):
    now_time = datetime.datetime.now()
    start_date = now_time.strftime('%Y-%m-%d')
    end_date = now_time + datetime.timedelta(days=365)
    end_date = end_date.strftime('%Y-%m-%d')
    dates_list = dateRange(start_date, end_date);
    available_dates = ','.join(dates_list)
    res = read_csv_return_dict('db/data/property.csv')
    for item in res:
        property = Property(property_id=int(item['property_id']),
                       title=item['title'],
                       property_type=item['property_type'],
                       amenities=item['amenities'],
                       price=item['price'],
                       bedrooms=int(item['bedrooms']),
                       bathrooms=float(item['bathrooms']),
                       accommodates=int(item['accommodates']),
                       minimum_nights=int(item['minimum_nights']),
                       description=item['description'],
                       notes=item['notes'],
                       house_rules=item['house_rules'],
                       start_time=round(time.mktime(datetime.date.today().timetuple())),
                       end_time=str(-1),
                       available_dates=available_dates)
        session.add(property)
    session.commit()


def init_host(session):
    res = read_csv_return_dict('db/data/host.csv')
    for item in res:
        host = Host(property_id=int(item['property_id']),
                    host_id=int(item['host_id']),
                    host_name=item['host_name'],
                    host_img_url=item['host_img_url'],
                    host_verifications=item['host_verifications'])
        session.add(host)
    session.commit()


def init_address(session):
    res = read_csv_return_dict('db/data/address.csv')
    for item in res:
        address = Address(property_id=int(item['property_id']),
                          suburb=item['suburb'],
                          city=item['city'],
                          state=item['state'],
                          country=item['country'],
                          latitude=round(item['latitude'], 6),
                          longitude=round(item['longitude'], 6),
                          location=item['location'],)
        session.add(address)
    session.commit()


def init_image(session):
    with open('db/data/image.json', 'r') as f:
        load_dict = json.load(f)
        for i in load_dict.keys():
            item = load_dict[i]
            image = Image(property_id=int(i), img_alt=str(item[0]), img_url=str(item[1]))
            session.add(image)
    session.commit()


def init_review(session):
    res = read_csv_return_dict('db/data/review.csv')
    for item in res:
        review = Review(property_id=int(item['property_id']),
                        reviewer_id=int(item['reviewer_id']),
                        reviewer_name=item['reviewer_name'],
                        review_date= item['review_date'],
                        review_content=item['review_content'],
                        head_picture=item['head_picture'])
        session.add(review)
    session.commit()

def init_request(session):
    res = read_csv_return_dict('db/data/request.csv')
    for item in res:
        request = Request(user_id=int(item['user_id']),
                          user_name=item['user_name'],
                          avatar=base_img_url+item['Avatar'],
                          request_title=item['request_title'],
                          request_content=item['request_content'],
                          request_time=item['request_time'])
        session.add(request)
    session.commit()

def init_comment(session):
    res = read_csv_return_dict('db/data/comment.csv')
    for item in res:
        comment = Comment(request_id=int(item['request_id']),
                          commenter_id=int(item['commenter_id']),
                          commenter_name=item['commenter_name'],
                          commenter_avatar=base_img_url+item['commenter_avatar'],
                          comment_content=item['comment_content'],
                          comment_time=item['comment_time'])
        session.add(comment)
    session.commit()

def init_order(session):
    res = read_csv_return_dict('db/data/order.csv')
    now_time = getLocalTime().split(' ')[0]
    comment_status = False

    for item in res:
        # change the available_date of property in order data
        proInfo = session.query(db.Property).filter_by(property_id=int(item['property_id'])).first()

        available_dates_list = proInfo.available_dates.split(',')
        order_dates_list = dateRange(item['checkIn'], item['checkOut'])
        available_dates = [item for item in available_dates_list if item not in order_dates_list]
        proInfo.available_dates = ','.join(available_dates)

        order_status = item['order_status']
        if order_status == 'Active':
            if item['checkOut'] < now_time:
                order_status = 'Finished'
                comment_status = True

        order = Order(user_id=int(item['user_id']),
                      property_id=int(item['property_id']),
                      order_time=item['order_time'],
                      checkIn=item['checkIn'],
                      checkOut=item['checkOut'],
                      guests=int(item['guests']),
                      order_status=order_status,
                      comment_status=comment_status)
        session.add(order)
    session.commit()

