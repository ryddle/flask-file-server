from flask import Blueprint, request, render_template, redirect, url_for
from config import root
from cosntants import *
from filters import *
import os
import json
import re
import mimetypes

tools = Blueprint('tools', __name__)

''' Notepad BP '''
@tools.route("/gcleansearch", methods=["GET"])
def gclean():
     return render_template("/gclean/index.html")

@tools.route("/viewerJSODF/index.html", methods=["GET"])
def viewerJSODF():
    url_hash = request.url.split("#")
    if len(url_hash) == 2:
        hash = url_hash[1]
    return render_template("viewerJSODF/index.html")
 
@tools.route("/audioplayer/index.html", methods=["GET"])
def audioplayer():
    p = "/audioplayer/index.html"
    dir_path = request.args.get("path")
    if dir_path:
        dir_path = dir_path.replace("/", "", 1)
    path = os.path.join(root, dir_path or "")
    path = os.path.normpath(path)
    if os.path.isdir(path):
        audio_files = []
        has_audio = False
        for filename in os.listdir(path):
            filename_noext, ext = os.path.splitext(filename)
            if ext in ignored:
                continue
            exts = datatypes.get("audio")
            if filename.split(".")[-1] in exts:
                audio_files.append(filename)
                has_audio = True
        try:
            audio_files = sorted(
                audio_files, key=lambda s: int(re.search(r"\d+", s).group())
            )
        except:
            audio_files = sorted(audio_files)
        return render_template(
            "/audioplayer/index.html",
            path=p,
            dir_path=path,
            audio_files=json.dumps(audio_files),
            has_audio=has_audio,
        )
 
@tools.route("/mediaplayer/index.html", methods=["GET"])
def mediaplayer():
    p = "/mediaplayer/index.html"
    dir_path = request.args.get("path")
    if dir_path:
        dir_path = dir_path.replace("/", "", 1)
    path = os.path.join(root, dir_path or "")
    path = os.path.normpath(path)
    if os.path.isdir(path):
        media_files = []
        has_audio = False
        for filename in os.listdir(path):
            filename_noext, ext = os.path.splitext(filename)
            if ext in ignored:
                continue
            media_src = {}
            data_type = data_fmt(filename)
            if data_type == "audio" or data_type == "video":
                media_src["mimetype"] = mimetypes.guess_type(filename)[0]
                media_src["name"] = filename
                media_files.append(media_src)
                has_audio = True
        return render_template(
            "/mediaplayer/index.html",
            path=p,
            dir_path=path,
            media_files=json.dumps(media_files),
        )