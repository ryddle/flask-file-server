# NOTE: This is a fork of the original repository: https://github.com/Wildog/flask-file-server
#       This repository is for personal use.
#       If you're looking for the original repository, visit: https://github.com/Wildog/flask-file-server

#flask-file-server

A flask file server with an elegant frontend for browsing, uploading and streaming files

![screenshot](https://raw.githubusercontent.com/Wildog/flask-file-server/master/screenshot.jpg)

## Changes in this version

* Eliminated login,
* Added button for deleting files and directories,
* Added possibility to create directories, including nested ones,
* Added button for connection with personal Youtube Audio Downloader application to download audios from YouTube videos or playlists to the selected directory,

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

