from prawbot import PrawBot
from parser import Parser
import json
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from starlette.requests import Request
import requests
import base64

app = FastAPI()
bot = PrawBot()
parser = Parser()

@app.get("/subreddit/{sub_name}")
def read_root(sub_name: str):
    return json.dumps(parser.parse(sub_name, bot.pull(sub_name)))

@app.get("/spotify/login")
def login_spotify():
    login_req = 'https://accounts.spotify.com/authorize?response_type=code&client_id=3f2c9540f73f41a9961f2e2f86357e18&redirect_uri=http://localhost:8000/spotify/authorize'
    return RedirectResponse(login_req)

@app.get("/spotify/authorize")
def authorize_spotify(request: Request) -> None:
    authorization_code =  request.query_params['code']
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
        'redirect_uri' : 'http://localhost:8000/spotify/authorize'
    }
    return requests.post('https://accounts.spotify.com/api/token', headers=headers, data=data).text
