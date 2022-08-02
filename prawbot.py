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
        return 'BQBdMOatBuXuibKZojz8K0T0JuaU5fCo74LgW4n5iEFkcjjbM-giMfc9QIcdhHu5OI8Iyq4wIVOv4g2IVew3eQw9oIRAYCCGAQSglFQn7B-0eNdBlgmn1CFbNpiqSV3FvnnQy3JXKTp-GlaYvQSm9-QzSx4FyZqnge7yrxOqlZZqNvuTwsNTciRduT_iiqqz0QpsMIOmS5bMlr-IOpIcZBiiqmJJi2QSy2A'

bot = PrawBot()
bot.update()