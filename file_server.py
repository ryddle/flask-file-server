from flask import (
    Flask,
    make_response,
    request,
    redirect,
    render_template,
    send_file,
    Response
)
from flask.views import MethodView
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from werkzeug.utils import secure_filename
from config import root, ytad_url
from cosntants import *
from filters import size_fmt, time_desc, time_humanize, icon_fmt, data_fmt
from api.api_routes import api
from api.api_methods import *
from notepad.notepad_routes import notepad
# from tools.tools_routes import tools
import shutil
import os
import re
import json
import mimetypes
from pathlib2 import Path
import logging


logging.basicConfig(
    filename="record.log",
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s",
)

app = Flask(__name__, static_url_path="/assets", static_folder="assets")
CORS(app)
bcrypt = Bcrypt(app)
key = ""

app.template_filter("size_fmt")(size_fmt)
app.template_filter("time_fmt")(time_desc)
app.template_filter("humanize")(time_humanize)
app.template_filter("icon_fmt")(icon_fmt)
app.template_filter("data_fmt")(data_fmt)


class PathView(MethodView):
    def get(self, p=""):
        hide_dotfile = request.args.get(
            "hide-dotfile", request.cookies.get("hide-dotfile", "no")
        )

        path = os.path.join(root, p)
        path = os.path.normpath(path)
        if os.path.isdir(path):
            contents = []
            audio_files = []
            has_audio = False
            image_files = []
            has_image = False
            total = {"size": 0, "dir": 0, "file": 0}
            for filename in os.listdir(path):
                filename_noext, ext = os.path.splitext(filename)
                if ext in ignored:
                    continue
                """ if hide_dotfile == 'yes' and filename[0] == '.':
                    continue """
                filepath = os.path.join(path, filename)
                stat_res = os.stat(filepath)
                info = {}
                info["name"] = filename
                info["mtime"] = stat_res.st_mtime
                ft = get_type(stat_res.st_mode)
                info["type"] = ft
                total[ft] += 1
                sz = stat_res.st_size
                info["size"] = sz
                total["size"] += sz
                ext = filename.split(".")[-1]
                if ext != "":
                    audio_exts = datatypes.get("audio")
                    if ext in audio_exts:
                        audio_files.append(filename)
                        has_audio = True
                    image_exts = datatypes.get("image")
                    if ext in image_exts:
                        image_files.append(filename)
                        has_image = True
                contents.append(info)
            try:
                audio_files = sorted(
                    audio_files, key=lambda s: int(re.search(r"\d+", s).group())
                )
            except:
                audio_files = sorted(audio_files)
            page = render_template(
                "index.html",
                path=p,
                dir_path=path,
                contents=contents,
                total=total,
                audio_files=json.dumps(audio_files),
                has_audio=has_audio,
                image_files=json.dumps(image_files),
                has_image=has_image,
                ytad_url=ytad_url,
                hide_dotfile=hide_dotfile,
            )
            res = make_response(page, 200)
            res.set_cookie("hide-dotfile", hide_dotfile, max_age=16070400)
        elif os.path.isfile(path):
            if "stream" in request.args:

                def generate():
                    with open(path, "rb") as fwav:
                        data = fwav.read(1024)
                        while data:
                            yield data
                            data = fwav.read(1024)

                return Response(generate(), mimetype="audio/mpeg")
            else:
                if "Range" in request.headers:
                    start, end = get_range(request)
                    res = partial_response(path, start, end)
                else:
                    if len(request.values) == 0 or not request.values["download"]:
                        res = send_file(path)
                    else:
                        res = send_file(path, as_attachment=True)
        else:
            res = make_response("Not found", 404)
        return res

    def put(self, p=""):
        if request.cookies.get("auth_cookie") == key:
            path = os.path.join(root, p)
            dir_path = os.path.dirname(path)
            Path(dir_path).mkdir(parents=True, exist_ok=True)

            info = {}
            if os.path.isdir(dir_path):
                try:
                    filename = secure_filename(os.path.basename(path))
                    with open(os.path.join(dir_path, filename), "wb") as f:
                        f.write(request.stream.read())
                except Exception as e:
                    info["status"] = "error"
                    info["msg"] = str(e)
                else:
                    info["status"] = "success"
                    info["msg"] = "File Saved"
            else:
                info["status"] = "error"
                info["msg"] = "Invalid Operation"
            res = make_response(json.JSONEncoder().encode(info), 201)
            res.headers.add("Content-type", "application/json")
        else:
            info = {}
            info["status"] = "error"
            info["msg"] = "Authentication failed"
            res = make_response(json.JSONEncoder().encode(info), 401)
            res.headers.add("Content-type", "application/json")
        return res

    def post(self, p=""):
        res = None
        if request.cookies.get("auth_cookie") == key:
            path = os.path.join(root, p)

            info = {}
                
            Path(path).mkdir(mode=0o777, parents=True, exist_ok=True)
            if os.path.isdir(path):
                files = request.files.getlist("files[]")
                for file in files:
                    try:
                        filename = secure_filename(file.filename)
                        file.save(os.path.join(path, filename))
                    except Exception as e:
                        info["status"] = "error"
                        info["msg"] = str(e)
                    else:
                        info["status"] = "success"
                        info["msg"] = "File Saved"
            else:
                info["status"] = "error"
                info["msg"] = "Invalid Operation"
            res = make_response(json.JSONEncoder().encode(info), 200)
            res.headers.add("Content-type", "application/json")
        else:
            info = {}
            info["status"] = "error"
            info["msg"] = "Authentication failed"
            res = make_response(json.JSONEncoder().encode(info), 401)
            res.headers.add("Content-type", "application/json")
        return res

    def delete(self, p=""):
        if request.cookies.get("auth_cookie") == key:
            path = os.path.join(root, p)
            dir_path = os.path.dirname(path)
            Path(dir_path).mkdir(parents=True, exist_ok=True)

            info = {}
            if os.path.isdir(dir_path):
                try:
                    filename = secure_filename(os.path.basename(path))
                    full_path = os.path.join(dir_path, filename)
                    if filename != "":
                        os.remove(full_path)
                    else:
                        shutil.rmtree(dir_path)
                except Exception as e:
                    info["status"] = "error"
                    info["msg"] = str(e)
                    print(e)
                else:
                    info["status"] = "success"
                    info["msg"] = "File Deleted"
            else:
                info["status"] = "error"
                info["msg"] = "Invalid Operation"
            res = make_response(json.JSONEncoder().encode(info), 204)
            res.headers.add("Content-type", "application/json")
        else:
            info = {}
            info["status"] = "error"
            info["msg"] = "Authentication failed"
            res = make_response(json.JSONEncoder().encode(info), 401)
            res.headers.add("Content-type", "application/json")
        return res

@app.route("/", methods=["GET", "POST", "PUT", "DELETE"])
def redirect_to_store():
    return redirect("/store", code=307)

@app.route("/gcleansearch", methods=["GET"])
def gclean():
     return render_template("/gclean/index.html")
 
@app.route("/gcleansearch/index.html", methods=["GET"])
def gcleanIndex():
     return render_template("/gclean/index.html")
 
@app.route("/store/viewerJSODF/index.html", methods=["GET"])
def storeViewerJSODF():
    return redirect("/viewerJSODF/index.html", code=307)

@app.route("/viewerJSODF/index.html", methods=["GET"])
def viewerJSODF():
    url_hash = request.url.split("#")
    if len(url_hash) == 2:
        hash = url_hash[1]
    return render_template("viewerJSODF/index.html")
 
@app.route("/audioplayer/index.html", methods=["GET"])
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
            path="store",
            dir_path=path,
            audio_files=json.dumps(audio_files),
            has_audio=has_audio,
        )
 
@app.route("/mediaplayer/index.html", methods=["GET"])
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

path_view = PathView.as_view("path_view")
app.add_url_rule("/store/", view_func=path_view)
app.add_url_rule("/store/<path:p>", view_func=path_view)

app.register_blueprint(api, url_prefix="/api")
app.register_blueprint(notepad, url_prefix="/notepad")
#app.register_blueprint(tools, url_prefix="/tools")

if __name__ == "__main__":
    from config import BIND, PORT, KEY
    from notepad.notepad_methods import *

    key = KEY
    create_database()
    app.run(BIND, PORT, threaded=True, debug=False)
