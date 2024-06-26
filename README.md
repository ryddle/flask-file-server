# NOTE: This is a fork of the original repository: https://github.com/Wildog/flask-file-server
#       This repository is for personal use.
#       If you're looking for the original repository, visit: https://github.com/Wildog/flask-file-server


# flask-file-server

A flask file server with an elegant frontend for browsing, uploading and streaming files

![screenshot](https://raw.githubusercontent.com/ryddle/flask-file-server/master/resources/screenshot.jpg)

## Changes in this repo

* Eliminated login
* Added button for deleting files and directories
* Added possibility to create directories, including nested ones
* Added button for connection with personal Youtube Audio Downloader application to download audios from YouTube videos or playlists to the selected directory
### Changes 20240505
* Eliminated listr.pack.js from templates and replaced for other libraries
* Added new libraries for visualization dialogs
* Added new audio player dialog for play all audios in folder with lyrics
* Added new independent page audio player linked from integrated audio player dialog
### Changes 20240508
* Now Audio Player is fully independent
* Now you can select all the folder with music for playing from Audio Player
* New menu for Analyzer customization grabbed from [Henrique Avila Vianna](https://henriquevianna.com) [CodePen](https://codepen.io/collection/ABbbKr)
* Youtube Audio Downloader services are now integrated
* Fixes and improvements

![screenshot2](https://raw.githubusercontent.com/ryddle/flask-file-server/master/resources/screenshot2.jpg)
![screenshot3](https://raw.githubusercontent.com/ryddle/flask-file-server/master/resources/screenshot3.jpg)
![screenshot4](https://raw.githubusercontent.com/ryddle/flask-file-server/master/resources/screenshot4.jpg)

<img src="https://raw.githubusercontent.com/ryddle/flask-file-server/master/resources/integrated_audio_player_01.png" width="300" />
<img src="https://raw.githubusercontent.com/ryddle/flask-file-server/master/resources/audio_player_01.png" width="300" />

## Build
```docker build --rm -t maaydin/flask-file-server:latest .```

## Run
```docker run -p 8000:8000 maaydin/flask-file-server```

## Params
FS_BIND = Param for bind address, default 0.0.0.0  
FS_PORT = Param for server port, default 8000  
FS_PATH = Param for serve path, default /tmp  
FS_KEY = Param for authentication key as base64 encoded username:password, default none  

```docker run -p 8000:8000 -e FS_BIND=0.0.0.0 -e FS_PORT=8000  -e FS_PATH=/tmp -e FS_KEY=dGVzdDp0ZXN0 maaydin/flask-file-server```

