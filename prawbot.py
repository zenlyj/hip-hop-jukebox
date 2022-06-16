import praw
import requests
from parser import Parser
import json

parser = Parser()

class PrawBot:
    def __init__(self):
        self.reddit = praw.Reddit(
            client_id = "hRpeSArQy1eKxZhwLtZxzg",
            client_secret = "EG0OUy1b2qfQBM1PYuY5z1gweOsstw",
            user_agent = "music_recommendation_bot",
        )

    def update(self):
        sub_name = 'hiphopheads'
        res = self.__pull(sub_name)
        for song in parser.parse(sub_name, res):
            self.__push(song)        
    
    def __pull(self, subreddit):
        titles = []
        for submission in self.reddit.subreddit(subreddit).hot(limit=100):
            titles.append(submission.title)
        return titles

    def __push(self, song):
        song = song.replace(' ', '')
        split = song.split('-')
        if len(split) != 2:
            return None 
        payload = {
            "title" : split[1],
            "artist" : split[0]
        }
        res = requests.post('http://localhost:8000/songs/', data=json.dumps(payload))
        print(res.text)

bot = PrawBot()
bot.update()