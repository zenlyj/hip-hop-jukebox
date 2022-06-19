import json

class Parser:
    def parse(self, subreddit, titles):
        if subreddit == "hiphopheads":
            return self.parseHipHopHeads(titles)

    def parseHipHopHeads(self, titles):
        relevantTitles = list(filter(lambda title : "[FRESH]" in title, titles))
        return list(map(lambda title: title.replace("[FRESH] ", ''), relevantTitles))

    def parseSpotifySearch(self, result):
        result = json.loads(result)
        return result['tracks']['items'][0]['uri']
