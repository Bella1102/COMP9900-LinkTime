import os
import hashlib
from sqlalchemy import *
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


engine = create_engine('sqlite:///db/dataBase.db?check_same_thread=False', echo = True)
Base = declarative_base()

class User(Base):
    __table__ = Table('User',
                        Base.metadata,
                        Column('id', Integer, primary_key=True),
                        Column('username', VARCHAR(8)),
                        Column('password', VARCHAR(20)),
                        Column('first_name', VARCHAR(20)),
                        Column('last_name', VARCHAR(20)),
                        Column('role', VARCHAR(10)),
                        Column('email', VARCHAR(20)),
                        Column('telephone', VARCHAR(20)),
                        Column('token', VARCHAR(64)),
                        Column('salt', VARCHAR(64)))

    def __repr__(self):
        return 'User:\nUsername: %s\nRole: %s' % (self.username, self.role)

class Property(Base):
    __table__ = Table('Property',
                        Base.metadata,
                        Column('id', Integer, primary_key=True),
                        Column('host_id', Integer),
                        Column('house_type', Text),
                        Column('price', Integer),
                        Column('description', Text),
                        Column('rate', NUMERIC),
                        Column('equipment', Text))

    def __repr__(self):
        return 'This is Property table'

# class Request(Base):
#     __table__ = Table('Request',
#                         Base.metadata,
#                         Column('id', Integer, primary_key=True),
#                         Column('user_id', Integer),
#                         Column('property_id', Integer)
#     def __repr__(self):
#         return 'This is Request Table'

# class Orders(Base):
#     __table__ = Table('Orders',
#                         Base.metadata,
#                         Column('id', Integer, primary_key=True),
#                         Column('user_id', Integer),
#                         Column('property_id', Integer)
#     def __repr__(self):
#         return 'This is Orders Table'


def init_db():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)

    Session = sessionmaker(engine)
    session = Session()
    # init dataBase
    init_user(session)
    # finish init
    session.close()

def get_session():
    Session = sessionmaker(engine)
    return Session()

def init_user(session):
    with open('db/init_db/users.csv') as f:
        for line in f.readlines():
            line = line.strip().split(',')
            salt = os.urandom(24)
            password_bytes = line[1].encode()
            hash_password = hashlib.sha256(salt + password_bytes).hexdigest()
            user = User(username=line[0], password=hash_password, first_name=line[2], last_name=line[3], role=line[4], email=line[5], telephone=line[6], token='', salt = salt)
            if (user.role == "admin"):
                user.token = 'admin'
            session.add(user)
    session.commit()





