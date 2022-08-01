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
        for submission in self.reddit.subreddit(subreddit).hot(limit=50):
            titles.append(submission.title)
        return titles

    def __push(self, song):
        split = song.split('-')
        if len(split) != 2: return
        title = split[1]
        artist = split[0]
        uri = self.__get_song_uri(title, artist)
        if (uri == None): return
        payload = {
            "title" : title,
            "artist" : artist,
            "uri" : uri
        }
        res = requests.post('http://localhost:8000/songs/', data=json.dumps(payload))
        print(res.text)

    def __get_song_uri(self, title, artist):
        params = {
            'query': title + ' ' + artist,
            'query_type': 'track',
            'token': self.__get_access_token()
        }
        res = requests.get('http://localhost:8000/spotify/search', params=params)
        if res.status_code == 200:
            return json.loads(res.text)['uri']
        else:
            return None

    def __get_access_token(self):
        return 'BQBDcelylHyv5KxsS61ktX4_f_lpWZ7ur1aojEpu0f1TR_rowqvzMY-kCrdCkKhz_dWGtW0kkMTQ3m5_I6lFwxZOoNj6VKNGv84foDbgNwprM26_Y_uz2nT6P7nrki8sVJJSr65bg6Ru08TA_QU-WyILqcissoik3-O-18FlHBzKfLJsV-yHSxJQlQ81qbY8QbLFQme-sdU_8obQTyK4GADYzEEKw5sG-WY'

bot = PrawBot()
bot.update()