import os
import hashlib
import json
import pandas as pd
from sqlalchemy import *
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


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
                        Column('start_time', VARCHAR(20)),
                        Column('end_time', VARCHAR(20)))
    def __repr__(self):
        # return 'This is Property table'
        return 'property_id: %s' % (self.property_id)

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
        return 'This is Host Table'

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
                        Column('latitude', NUMERIC),
                        Column('longitude', NUMERIC))
    def __repr__(self):
        return 'This is Property Address Table'

# 5
class Image(Base):
    __table__ = Table('Image',
                        Base.metadata,
                        Column('id', Integer, primary_key=True),
                        Column('property_id', Integer),
                        Column('img_url', Text),
                        Column('img_alt', Text))
    def __repr__(self):
        return 'This is Property Image Table'

# 6
class Review(Base):
    __table__ = Table('Review',
                        Base.metadata,
                        Column('id', Integer, primary_key=True),
                        Column('property_id', Integer),
                        Column('reviewer_id', Integer),
                        Column('reviewer_name',  VARCHAR(20)),
                        Column('review_date', VARCHAR(20)),
                        Column('review_content', Text))
    def __repr__(self):
        return 'This is Review Table'

# 7
class Order(Base):
    __table__ = Table('Order',
                        Base.metadata,
                        Column('id', Integer, primary_key=True),
                        Column('user_id', Integer),
                        Column('property_id', Integer),
                        Column('guests_num', Integer),
                        Column('start_time', VARCHAR(20)),
                        Column('end_time', VARCHAR(20)),
                        Column('order_time', VARCHAR(20)),
                        Column('order_status', VARCHAR(20)))
    def __repr__(self):
        return 'This is Orders Table'

# 8
class Request(Base):
    __table__ = Table('Request',
                        Base.metadata,
                        Column('id', Integer, primary_key=True),
                        Column('user_id', Integer),
                        Column('request_title', VARCHAR(30)),
                        Column('request_content', Text),
                        Column('request_time', Text))
    def __repr__(self):
        return 'This is Request Table'



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
            user = User(username=line[0], password=hash_password, email=line[2], phone=line[3], token='', key=key)
            session.add(user)
    session.commit()


def init_property(session):
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
                       house_rules=item['house_rules'],)
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
                          latitude=item['latitude'],
                          longitude=item['longitude'])
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
                        review_date=item['review_date'],
                        review_content=item['review_content'])
        session.add(review)
    session.commit()


