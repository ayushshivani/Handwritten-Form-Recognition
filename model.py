from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from flask import *
from sqlalchemy import *

Base = declarative_base()
engine = create_engine('sqlite:///user.db',connect_args={'check_same_thread': False})
engine.connect()
Session = sessionmaker(bind=engine)
sqlsession = Session()


class User(Base):
    __tablename__ = "user"

    id = Column('id', Integer, Sequence('user_id_seq'), primary_key=True)
    name = Column('name', String(255))
    emailid = Column('emailid', String(255))
    username = Column('username', String(255))
    password = Column('password', String(255))
    templates = relationship('Template', backref = 'user', cascade="save-update, merge, delete")
    fields = relationship('Field', backref = 'user', cascade="save-update, merge, delete")

class Template(Base):
    __tablename__ = "template"

    id = Column('id', Integer, Sequence('user_id_seq'), primary_key=True)
    name = Column('name', String(255))
    description = Column('description', String(255))
    createdon = Column('createdon', String(255))
    userid = Column('userid', Integer, ForeignKey('user.id'))
    fields = relationship('Field',backref = 'template', cascade="save-update, merge, delete")

class Field(Base):
    __tablename__ = 'field'

    id = Column('id', Integer, Sequence('user_id_seq'), primary_key=True)
    name = Column('name', String(255))
    Type = Column('type', String(255))
    description = Column('description', String(255))
    boxcount = Column('boxcount', Integer)
    leftx = Column('leftx', Integer)
    rightx = Column('rightx', Integer)
    topy = Column('topy', Integer)
    bottomy = Column('bottomy', Integer)
    percentleftx = Column('percentleftx', Float)
    percentrightx = Column('percentrightx', Float)
    percenttopy = Column('percenttopy', Float)
    percentbottomy = Column('percentbottomy', Float)
    templateid = Column('templateid',Integer, ForeignKey('template.id'))
    userid = Column('userid', Integer, ForeignKey('user.id'))
    markedon = Column('markedon', String(255))
    anchor = Column('anchor', Boolean)

Base.metadata.create_all(bind=engine)
