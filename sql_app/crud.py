from sqlalchemy.orm import Session

from . import models, schemas

def get_songs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Song).offset(skip).limit(limit).all()

def create_song(db: Session, song: schemas.SongCreate):
    song = models.Song(title=song.title, artist=song.artist)
    db.add(song)
    db.commit()
    db.refresh(song)
    return song