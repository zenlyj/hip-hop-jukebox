from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base

class Song(Base):
    __tablename__ = "songs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    artist = Column(String)

class Playlist(Base):
    __tablename__ = "playlist"

    id = Column(Integer, primary_key=True, index=True)
    authentication_code = Column(String)
    song = Column(Integer, ForeignKey("songs.id"))