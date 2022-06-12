import praw

class PrawBot:
    def __init__(self):
        self.reddit = praw.Reddit(
            client_id = "hRpeSArQy1eKxZhwLtZxzg",
            client_secret = "EG0OUy1b2qfQBM1PYuY5z1gweOsstw",
            user_agent = "music_recommendation_bot",
        )
    
    def pull(self, subreddit):
        titles = []
        for submission in self.reddit.subreddit(subreddit).hot(limit=100):
            titles.append(submission.title)
        return titles