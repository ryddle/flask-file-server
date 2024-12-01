from ytd.ytd import YouTubeDownloaderInterface
from werkzeug.utils import secure_filename
import os
import shutil
import yt_dlp

class YtdlpYtd(YouTubeDownloaderInterface):
    def __init__(self, url):
        self.url = url
        self.ydl_audio_opts = {'outtmpl': '%(title)s.mp3'}
        self.ydl_video_opts = {'outtmpl': '%(title)s.%(ext)s'}

    def downloadAudioFiles(self, urls: list, destination):
        self.ydl_audio_opts['format'] = 'bestaudio'
        #self.ydl_audio_opts['progress_hooks'] = [self.my_hook]
        filenames = {}
        errors = []
        with yt_dlp.YoutubeDL(self.ydl_audio_opts) as ydl:
            for url in urls:
                try:
                    info_dict = ydl.extract_info(url, download=True)
                    filename = ydl.prepare_filename(info_dict)
                    if os.path.exists(destination) == False:
                        os.mkdir(destination)
                    destPath = os.path.join(destination, secure_filename(filename)) #os.path.join(destination, filename)
                    shutil.move(filename, destPath)
                    filenames[filename] = destPath
                except Exception as e:
                    errors.append(url)
                    continue
        return filenames, errors

    def downloadVideoFiles(self, urls: list, destination):
        self.ydl_video_opts['format'] = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]'
        filenames = {}
        errors = []
        with yt_dlp.YoutubeDL(self.ydl_video_opts) as ydl:
            for url in urls:
                try:
                    info_dict = ydl.extract_info(url, download=True)
                    filename = ydl.prepare_filename(info_dict)
                    if os.path.exists(destination) == False:
                        os.mkdir(destination)
                    destPath = os.path.join(destination, secure_filename(filename)) #os.path.join(destination, filename)
                    shutil.move(filename, destPath)
                    filenames[filename] = destPath
                except Exception as e:
                    errors.append(url)
                    continue
        return filenames, errors

    def downloadAudioPlaylist(self, url, destination):
        self.ydl_audio_opts['format'] = 'bestaudio'
        self.ydl_audio_opts['playlist_start'] = 1
        self.ydl_audio_opts['ignoreerrors'] = True
        with yt_dlp.YoutubeDL(self.ydl_audio_opts) as ydl:
            info_dict = ydl.extract_info(url, download=False)
        
        plurls = []
        if 'entries' in info_dict:
            plurls = [entry['original_url'] for entry in info_dict['entries']]
        
        return self.downloadAudioFiles(plurls, destination)

        '''
        ydl_opts = {'format': 'bestaudio/best',
            'outtmpl': '%(title)s.%(ext)s',
            'playlist_start': 1,
            'playlist_items': 'all',
            'ignoreerrors': True}

        playlist_url = 'https://www.youtube.com/playlist?list=PLAYLIST_ID'

        ydl = yt_dlp.YoutubeDL(ydl_opts)
        ydl.download([playlist_url])
        '''

    def downloadVideoPlaylist(self, url, destination):
        self.ydl_video_opts['format'] = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]'
        with yt_dlp.YoutubeDL(self.ydl_video_opts) as ydl:
            info_dict = ydl.extract_info(url, download=False)
        
        plurls = []
        if 'entries' in info_dict:
            plurls = [entry['original_url'] for entry in info_dict['entries']]
        
        return self.downloadVideoFiles(plurls, destination)
    
    def my_hook(d):
        if d['status'] == 'finished':
            print('Done downloading, now post-processing ...')


if __name__ == '__main__':
    #url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

    destination = './filestore/anni_b_sweet/'
    
    #url = 'https://www.youtube.com/watch?v=-azdLo1DTSA'
    url = 'https://www.youtube.com/watch?v=WryPKTlSciw'
    ytd = YtdlpYtd(url)
    filesObj, errors = ytd.downloadAudioFiles([url], destination)
    print(filesObj)
    print(errors)
    #ytd.downloadVideoFiles([url], destination)
    
    destination = './filestore/anni_b_sweet/hide_and_show/'
    
    playlist = 'https://www.youtube.com/watch?v=JZke65Z1_XY&list=OLAK5uy_m5bNzucyFBf9VPnjuFxXdlu4l9swadb1I'
    ytd = YtdlpYtd(playlist)
    #ytd.downloadAudioPlaylist(playlist, destination)
    #ytd.downloadVideoPlaylist(playlist, destination)
