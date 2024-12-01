from ytd.ytd import YouTubeDownloaderInterface
from pytube import YouTube

class PytubeYtd(YouTubeDownloaderInterface):
    def __init__(self, url):
        self.youtube = YouTube(url)

    def downloadAudioFiles(self, url, destination):
        self.youtube = YouTube(url)
        audio = self.youtube.streams.filter(only_audio=True, file_extension='mp4').first()
        audio.download(destination)

    def downloadVideoFiles(self, url, destination):
        self.youtube = YouTube(url)
        video = self.youtube.streams.filter(progressive=True, file_extension='mp4').first()
        video.download(destination)

    def downloadAudioPlaylist(self, url, destination):
        youtube = YouTube(url)
        for video in youtube.videos:
            audio = video.streams.filter(only_audio=True, file_extension='mp4').first()
            filename = audio.default_filename
            audio.download(filename=filename)
        return filename

    def downloadVideoPlaylist(self, url, destination):
        youtube = YouTube(url)
        for video in youtube.videos:
            video = video.streams.filter(progressive=True, file_extension='mp4').first()
            filename = video.default_filename
            video.download(filename=filename)
        return filename
