class M3U:
    @classmethod
    def create(cls, playlist, path='playlist.m3u'):
        with open(path, 'w') as f:
            for obj in playlist:
                f.write(f"#EXTINF:{obj['name']}\n{obj['url']}\n")

    @classmethod
    def parse(cls, path):
        with open(path) as f:
            playlist = []
            name = ''
            for line in f:
                if line.startswith('#EXTINF:'):
                    name = line.split(':',1)[1].strip()
                else:
                    playlist.append({'url': line.strip(), 'name': name})
            return playlist




if __name__ == '__main__':
    playlist = [
        {'name': 'Song 1', 'url': 'http://url1.com'},
        {'name': 'Song 2', 'url': 'http://url2.com'},
        {'name': 'Song 3', 'url': 'http://url3.com'}
    ]
    M3U.create(playlist, 'playlist32354.m3u')
    print(M3U.parse('playlist32354.m3u'))



