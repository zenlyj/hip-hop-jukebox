from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
from sql_app.database import SessionLocal, engine
from fastapi.responses import RedirectResponse
from starlette.requests import Request
import requests
import base64
from fastapi.middleware.cors import CORSMiddleware
from sql_app import crud, models, schemas
from typing import List
import json
from parser import Parser

models.Base.metadata.create_all(bind=engine)
parser = Parser()

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/spotify/authorize/")
def authorize_spotify(authorization_code: str):
    client_id = '3f2c9540f73f41a9961f2e2f86357e18'
    client_secret = '056631f28de642a48fe6e8a30523b4a7'
    client_credentials = (client_id + ':' + client_secret).encode('ascii')
    client_credentials = base64.b64encode(client_credentials)
    headers = {
        'Authorization' : 'Basic ' + client_credentials.decode('utf-8'),
        'Content-Type' : 'application/x-www-form-urlencoded'
    }
    data = {
        'grant_type' : 'authorization_code',
        'code' : authorization_code,
        'redirect_uri' : 'http://localhost:3000/home/'
    }
    return requests.post('https://accounts.spotify.com/api/token', headers=headers, data=data).text

@app.get("/spotify/search/")
def search_spotify(query: str, query_type: str, token: str):
    url = 'https://api.spotify.com/v1/search'
    params = {
        'q' : query,
        'type' : query_type,
        'limit' : 1
    }
    headers = {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        'Authorization' : 'Bearer ' + token
    }
    res = requests.get(url, headers=headers, params=params)
    uri = parser.parseSpotifySearch(res.text)
    obj = {
        'uri' : uri
    }
    return json.dumps(obj)


@app.get("/songs/", response_model=List[schemas.Song])
def get_songs(db: Session = Depends(get_db)):
    return crud.get_songs(db)

@app.post("/songs/", response_model=schemas.Song)
def add_songs(song: schemas.SongCreate, db: Session = Depends(get_db)):
    return crud.create_song(db, song)
