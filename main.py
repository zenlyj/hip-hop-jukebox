from prawbot import PrawBot
from parser import Parser
import json
from fastapi import FastAPI

app = FastAPI()
bot = PrawBot()
parser = Parser()

@app.get("/subreddit/{sub_name}")
def read_root(sub_name: str):
    return json.dumps(parser.parse(sub_name, bot.pull(sub_name)))