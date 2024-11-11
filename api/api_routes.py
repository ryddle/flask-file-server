# app/api/routes.py
from flask import Blueprint, request, redirect, url_for
from config import *
from cosntants import *
from api.api_methods import *
from m3u import M3U
from pytube import Playlist
import os
import json
import re
import shutil
import lyricsgenius

import logging


logging.basicConfig(
    filename="api.log",
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s",
)

logger = logging.getLogger(__name__)

api = Blueprint('api', __name__)

''' API BP '''
''' API GET ENDPOINTS '''
@api.route("/getLyrics", methods=["GET"])
def getLyrics():
    orig_title = request.args.get("title")
    full_path = request.args.get("path")
    logger.info("%s orig_title", orig_title)
    logger.info("%s full_path", full_path)
    if full_path:
        logger.info("%s full_path exists", full_path)
        if not full_path.startswith(root):
            full_path = full_path.replace(request.host_url + "store", "")
            logger.info("%s proxy_url", proxy_url)
            full_path = full_path.replace(proxy_url, "")
            if full_path.startswith("/"):
                full_path = full_path.replace("/", "", 1)
            urlpattern = r"((http|https)\:\/\/)?[0-9\.\/\?\:@\-_=#]+\/+"
            full_path = re.sub(
                urlpattern, "", full_path
            )  # "((http|https)\:\/\/)?[0-9\.\/\?\:@\-_=#]+\/+"gm
            logger.info("%s full_path replaced url", full_path)
            logger.info("%s root", root)
            full_path = os.path.join(root, full_path)
            # full_path = root + full_path
            logger.info("%s full_path joined root", full_path)
            full_path = os.path.normpath(full_path)
            logger.info("%s norm full_path", full_path)
        full_path_no_ext, ext = os.path.splitext(full_path)
        full_path = full_path_no_ext + ".lyr"
        logger.info("%s full_path as lyr", full_path)
    if os.path.exists(full_path):
        with open(full_path, encoding="utf-8") as f:
            song = json.load(f)
        result = {}
        result["lyrics"] = song["lyrics"]
        result["body"] = song["_body"]
        if "lyrics_ts" in song:
            result["lyrics_ts"] = song["lyrics_ts"]
        return json.dumps(result)
    else:
        title = (
            orig_title.replace("_", " ").replace(".mp3", "").replace("-", "")
        )
        title = re.sub(r"\d+\.", "", title).replace("/", " ")
        title = title.lower().strip()
        for term in lyrics_excluded_terms:
            if term in title:
                title = title.replace(term, "").strip()
                title = re.sub(r"\s+", " ", title)
        genius = lyricsgenius.Genius(
            GENIUS_ACCESS_TOKEN,
            response_format="html",
            sleep_time=1.0,
            timeout=15,
            retries=3,
        )
        song = genius.search_song(title=title, artist=title)
        if song != None and song.lyrics:
            logger.info("%s song info returned", song.title)
            if song.title.lower() == "Band Names".lower():
                return {"status": 400, "error": "No lyrics found"}
            _song = {}
            _song["lyrics"] = song.lyrics
            _song["_body"] = song._body
            logger.info("%s writting song", song.title)
            with open(full_path, "w") as f:
                json.dump(_song, f, indent=4)
            result = {}
            result["lyrics"] = (song.lyrics,)
            result["body"] = song._body
            return json.dumps(result)
        else:
            logger.info("%s no song returned")
            result = {}
            result["status"] = 400
            result["error"] = "No lyrics found"
            return json.dumps(result)

@api.route("/getMediaFolderTree", methods=["GET"])
def getMediaFolderTree():
    jsonTree = create_media_folder_structure_json(root)
    return jsonTree

@api.route("/getMusicFolderTree", methods=["GET"])
def getMusicFolderTree():
    jsonTree = create_music_folder_structure_json(root)
    return jsonTree

@api.route("/getFolderTree", methods=["GET"])
def getFolderTree():
    jsonTree = create_folder_structure_json(root)
    return jsonTree

@api.route("/getPlaylistM3u", methods=["GET"])
def getPlaylistM3u():
    path = request.args.get("path")
    if not path or not path.endswith(".m3u"):
        return {"status": 400, "error": "No playlist found"}
    if path.startswith("/"):
        path = path.replace("/", "", 1)
    path = os.path.join(root, path)
    path = os.path.normpath(path)
    if os.path.exists(path):
        playlist = M3U.parse(path)
        return {"status": 200, "playlist": playlist}
    else:
        return {"status": 400, "error": "No playlist found"}
    
    
''' API POST ENDPOINTS '''
@api.route("/playlist", methods=["POST"])
def playlist():
    res_obj = {}
    playlist_url = request.form.get("playlist_url")
    dir_path = os.path.join(root, request.form.get("path"))
    print(playlist_url)
    if not playlist_url:
        res_obj["status"] = "error"
        res_obj["msg"] = "Empty playlist URL"
        return redirect(
            url_for("path_view", p=request.form.get("path")),
            302,
            json.JSONEncoder().encode(res_obj),
        )
    try:
        playlist = Playlist(playlist_url)
        videos = []
        for url in playlist.video_urls:
            print(url)
            videos.append(url)
        if not videos:
            res_obj["status"] = "error"
            res_obj["msg"] = "Playlist is empty"
            return redirect(
                url_for("path_view", p=request.form.get("path")),
                302,
                json.JSONEncoder().encode(res_obj),
            )
        yturls = ",".join(videos)
        print(yturls)
        filesObj, errors = downloadUrls(videos, dir_path)
        print(filesObj)
        print(errors)
        res_obj["status"] = "success"
        res_obj["data"] = filesObj
        res_obj["errors"] = errors
        return redirect(
            url_for("path_view", p=request.form.get("path")),
            302,
            json.JSONEncoder().encode(res_obj),
        )
    except Exception as e:
        import traceback

        traceback.print_exc()
        res_obj["status"] = "error"
        res_obj["msg"] = traceback.format_exc()
        return redirect(
            url_for("path_view", p=request.form.get("path")),
            302,
            json.JSONEncoder().encode(res_obj),
        )
    
@api.route("/genPlaylistM3u", methods=["POST"])
def genPlaylistM3u():
    res_obj = {}
    playlist_obj = json.loads(
        request.form.get("playlist_obj")
    )
    dest_path = os.path.join(root, request.form.get("path"))
    print(playlist_obj)
    try:
        M3U.create(playlist_obj, dest_path)
        res_obj["status"] = "success"
        return res_obj
    except Exception as e:
        import traceback

        traceback.print_exc()
        res_obj["status"] = "error"
        res_obj["msg"] = traceback.format_exc()
        return res_obj

@api.route("/search", methods=["POST"])
def search():
    search = request.form.get("search")
    path = os.path.join(root, request.form["path"])
    path = os.path.normpath(path)
    if os.path.isdir(path):
        try:
            global search_results
            search_results = []
            search_items(path, search)
        except Exception as e:
            print(e)
            return {"status": "error", "msg": str(e)}
    try:
        return {"status": "success", "results": search_results}
    except Exception as e:
        return {"status": "error", "msg": str(e)}

@api.route("/searchSong", methods=["POST"])
def searchSong():
    title = request.form["title"]
    artist = request.form["artist"]
    full_path = request.form["full_path"]
    if full_path.startswith("/"):
        full_path = full_path.replace("/", "", 1)
    full_path = os.path.join(root, full_path)
    full_path = os.path.normpath(full_path)
    full_path_no_ext, ext = os.path.splitext(full_path)
    full_path = full_path_no_ext + ".lyr"
    genius = lyricsgenius.Genius(
        GENIUS_ACCESS_TOKEN,
        response_format="html",
        sleep_time=1.0,
        timeout=15,
        retries=3,
    )
    song = genius.search_song(title=title, artist=artist)
    if song != None and song.lyrics:
        if song.title.lower() == "Band Names".lower():
            return {"status": 400, "error": "No lyrics found"}
        _song = {}
        _song["lyrics"] = song.lyrics
        _song["_body"] = song._body
        with open(full_path, "w") as f:
            json.dump(_song, f, indent=4)
        result = {}
        result["lyrics"] = (song.lyrics,)
        result["body"] = song._body
        return json.dumps(result)
    else:
        result = {}
        result["status"] = 400
        result["error"] = "No lyrics found"
        return json.dumps(result)
    
@api.route("/ytdown", methods=["POST"])
def ytdown():
    res_obj = {}
    yturls = list(map(str.strip, request.form["videos_urls"].split(",")))
    dir_path = os.path.join(root, request.form.get("path"))
    filesObj, errors = downloadUrls(yturls, dir_path)
    res_obj["status"] = "success"
    res_obj["data"] = filesObj
    res_obj["errors"] = errors
    return redirect(
        url_for("path_view", p=request.form.get("path")),
        302,
        json.JSONEncoder().encode(res_obj),
    )

@api.route("/newfolder", methods=["POST"])
def newfolder():
    info = {}
    path = os.path.join(root, request.form["path"])
    path = os.path.normpath(path)
    if os.path.isdir(path):
        try:
            newpath = os.path.join(path, request.form["foldername"].strip())
            newpath = os.path.normpath(newpath)
            os.mkdir(newpath, mode=0o777)
            dir_path = newpath[len(root) + 1 :]
            dir_path = dir_path.replace("\\", "/")
        except Exception as e:
            info["status"] = "error"
            info["msg"] = str(e)
        return redirect(
            url_for("path_view", p=dir_path),
            302,
            json.JSONEncoder().encode(info),
        )

@api.route("/renamepath", methods=["POST"])
def rename():
    info = {}
    opath = os.path.join(root, request.form["renamepath_opath"])
    opath = os.path.normpath(opath)
    renamepath_dpath = request.form["renamepath_dpath"]
    filename = secure_filename(renamepath_dpath.split("/")[-1])
    path = renamepath_dpath[: -len(filename)]
    dpath = os.path.join(root, path, filename)
    dpath = os.path.normpath(dpath)
    dir_path = path
    if os.path.exists(opath) and opath != dpath:
        try:
            os.rename(opath, dpath)
            opath_ext = os.path.splitext(opath)[1]
            if opath_ext == ".mp3":
                opath_lyr = opath.replace(opath_ext, ".lyr")
                if os.path.exists(opath_lyr):
                    os.rename(opath_lyr, dpath.replace(opath_ext, ".lyr"))
        except Exception as e:
            info["status"] = "error"
            info["msg"] = str(e)
        else:
            info["status"] = "success"
            info["msg"] = "File Renamed"
            """dir_path = dpath[len(root)+1:]
            dir_path = dir_path.replace('\\', '/')"""
        return redirect(
            url_for("path_view", p=dir_path),
            302,
            json.JSONEncoder().encode(info),
        )
    else:
        info["status"] = "error"
        info["msg"] = "Invalid Operation"
        return redirect(
            url_for("path_view", p=dir_path),
            302,
            json.JSONEncoder().encode(info),
        )

@api.route("/movepath", methods=["POST"])
def movepath():
    info = {}
    opath = os.path.join(root, request.form["opath"])
    opath = os.path.normpath(opath)
    dpath = os.path.join(root, request.form["dpath"])
    dpath = os.path.normpath(dpath)
    if os.path.exists(opath) and opath != dpath:
        try:
            if os.path.isdir(opath):
                shutil.move(opath, dpath, copy_function=shutil.copytree)
            else:
                shutil.move(opath, dpath)
        except Exception as e:
            info["status"] = "error"
            info["msg"] = str(e)
        else:
            info["status"] = "success"
            info["msg"] = "File Moved"
            dir_path = dpath[len(root) + 1 :]
            dir_path = dir_path[
                : -len(request.form["movepath_filename"])
            ]  # dir_path.replace(request.form['movepath_filename'],'')
            dir_path = dir_path.replace("\\", "/")
        return redirect(
            url_for("path_view", p=dir_path),
            302,
            json.JSONEncoder().encode(info),
        )
    else:
        info["status"] = "error"
        info["msg"] = "Invalid Operation"
        return redirect(
            url_for("path_view", p=dir_path),
            302,
            json.JSONEncoder().encode(info),
        )
