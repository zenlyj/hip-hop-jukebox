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
        print(uri)
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
            'access_token': self.__get_access_token()
        }
        res = requests.get('http://localhost:8000/spotify/search', params=params)
        if res.status_code == 200:
            return json.loads(res.text)['uri']
        else:
            return None

    def __get_access_token(self):
        return 'BQBMznIPFzp3ut7-kt4QfymlbiJrdnTglWiZwxe1Z0iE-t8EhVQaeSd_ZzTkIA5D1eIHXbxs04Iaz3rUyW3wjmnWZ3B3R9BX7qpDUxVKGyKtgaLSnkef1FN7TuBQ_qQPmaVbskvzmLn99YlTjYLxcwdVB3tDohoS0s1eq-ca95PhW2PFpN2jrHXEU4s0W4mrud9DeHrmP1GDMFAYYQACvmeLCrKn0MjOkMI'

bot = PrawBot()
bot.update()