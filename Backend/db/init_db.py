import os
import hashlib
from sqlalchemy import *
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


engine = create_engine('sqlite:///db/dataBase.db?check_same_thread=False', echo = True)
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
                        Column('price', Integer),
                        Column('bedrooms', Integer),
                        Column('bathrooms', Integer),
                        Column('accommodates', Integer),
                        Column('minimum_nights', Integer),
                        Column('description', Text),
                        Column('notes', Text),
                        Column('house_rules', Text),
                        Column('start_time', VARCHAR(20)),
                        Column('end_time', VARCHAR(20)))
    def __repr__(self):
        return 'This is Property table'

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
                        Column('state', VARCHAR(20)),
                        Column('city', VARCHAR(20)),
                        Column('suburb', VARCHAR(20)),
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
    with open('db/data/property.csv') as f:
        for line in f.readlines():
            line = line.strip().split(',')
            amenitie = line[3]
            property = Property(property_id=line[0], title=line[1], property_type=line[2], amenitie=line[3], \
                                price=line[4], bedrooms=line[5], bathrooms=line[6],accommodates=line[7], \
                                minimum_nights=line[8], description=line[9], notes=line[10], house_rules=line[11], \
                                start_time=line[12], end_time=line[13])
            session.add( property)
    session.commit()

def init_host(session):
    with open('db/data/host.csv') as f:
        for line in f.readlines():
            line = line.strip().split(',')
            host = Host(property_id=line[0], host_id=line[1], host_name=line[2],
                                host_img_url=line[3], host_verifications=line[4])
            session.add(host)
    session.commit()

def init_address(session):
    with open('db/data/address.csv') as f:
        for line in f.readlines():
            line = line.strip().split(',')
            address = Address(property_id=line[0], state=line[1], city=line[2], suburb=line[3],
                        location=line[4], postcode=line[5], latitude=line[6], longitude=line[7])
            session.add(address)
    session.commit()

def init_image(session):
    with open('db/data/image.json') as f:
        for line in f.readlines():
            line = line.strip().split(',')
            image = Image(property_id=line[0], img_url=line[1], img_alt=line[2])
            session.add(image)
    session.commit()

def init_review(session):
    with open('db/data/review.json') as f:
        for line in f.readlines():
            line = line.strip().split(',')
            review = Review(property_id=line[0], reviewer_id=line[1], reviewer_name=line[2],
                            review_date=line[3], review_content=line[4])
            session.add(review)
    session.commit()



