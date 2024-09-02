from flask import Flask, make_response, request, redirect, render_template, send_file, Response, url_for
from flask.views import MethodView
from flask_cors import CORS
from werkzeug.utils import secure_filename
from datetime import datetime
from config import (root, ytad_url, proxy_url, GENIUS_ACCESS_TOKEN)
from pytube import YouTube, Playlist
import shutil
import humanize
import os
import re
import stat
import json
import mimetypes
from pathlib2 import Path
import lyricsgenius
import logging
from m3u import M3U

logging.basicConfig(filename='record.log', level=logging.INFO, format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')

app = Flask(__name__, static_url_path='/assets', static_folder='assets')
CORS(app)
key = ""

ignored = ['.lyr','.sbo','.bzr', '$RECYCLE.BIN', '.DAV', '.DS_Store', '.git', '.hg', '.htaccess', '.htpasswd', '.Spotlight-V100', '.svn', '__MACOSX', 'ehthumbs.db', 'robots.txt', 'Thumbs.db', 'thumbs.tps']
datatypes = {'audio': 'm4a,mp3,oga,ogg,webma,wav', 'archive': '7z,zip,rar,gz,tar', 'image': 'gif,ico,jpe,jpeg,jpg,png,svg,webp', 'pdf': 'pdf', 'quicktime': '3g2,3gp,3gp2,3gpp,mov,qt', 'source': 'atom,bat,bash,c,cmd,coffee,css,hml,js,json,java,less,markdown,md,php,pl,py,rb,rss,sass,scpt,swift,scss,sh,xml,yml,plist', 'text': 'txt', 'video': 'mp4,m4v,ogv,webm,mkv,avi', 'website': 'htm,html,mhtm,mhtml,xhtm,xhtml', 'doc': 'odt, ods, odp, docx, xlsx, pptx'}
icontypes = {'fa-music': 'm4a,mp3,oga,ogg,webma,wav', 'fa-archive': '7z,zip,rar,gz,tar', 'fa-picture-o': 'gif,ico,jpe,jpeg,jpg,png,svg,webp', 'fa-file-text': 'pdf', 'fa-film': '3g2,3gp,3gp2,3gpp,mov,qt', 'fa-code': 'atom,plist,bat,bash,c,cmd,coffee,css,hml,js,json,java,less,markdown,md,php,pl,py,rb,rss,sass,scpt,swift,scss,sh,xml,yml', 'fa-file-text-o': 'txt', 'fa-film': 'mp4,m4v,ogv,webm,mkv,avi', 'fa-globe': 'htm,html,mhtm,mhtml,xhtm,xhtml', 'fa-file-text': 'doc'}

lyrics_excluded_terms = ['official music video', 'video', 'vynil', 'hq', 'rip', 'lyrics', 'lyrics', 'letra', 'versos', 'versos', 'paroles', 'paroles', 'liedtexte', 'liedtexte', '歌詞', '歌詞', 'muziek', 'muziek', 'liedtext', 'liedtext', 'muziek', 'muziek', 'notas', 'notas', 'notas', 'notas', 'notas', 'notas']

@app.template_filter('size_fmt')
def size_fmt(size):
    return humanize.naturalsize(size)

@app.template_filter('time_fmt')
def time_desc(timestamp):
    mdate = datetime.fromtimestamp(timestamp)
    str = mdate.strftime('%Y-%m-%d %H:%M:%S')
    return str

@app.template_filter('data_fmt')
def data_fmt(filename):
    t = 'unknown'
    for type, exts in datatypes.items():
        if filename.split('.')[-1] in exts:
            t = type
    return t

@app.template_filter('has_audio')
def has_audio(filename):
    t = False
    for exts in datatypes.items():
        if filename.split('.')[-1] in exts:
            t = True
    return t

@app.template_filter('icon_fmt')
def icon_fmt(filename):
    i = 'fa-file-o'
    for icon, exts in icontypes.items():
        if filename.split('.')[-1] in exts:
            i = icon
    return i

@app.template_filter('humanize')
def time_humanize(timestamp):
    mdate = datetime.fromtimestamp(timestamp)
    return humanize.naturaltime(mdate)

def get_type(mode):
    if stat.S_ISDIR(mode) or stat.S_ISLNK(mode):
        type = 'dir'
    else:
        type = 'file'
    return type

def partial_response(path, start, end=None):
    file_size = os.path.getsize(path)
    
    if end is not None:
        if start>end:
            #start, end = 0, file_size-1
            start, end = 0, min(file_size - 1, start + int(file_size/10) - 1)

    if end is None:
        #end = file_size - start - 1
        end = min(file_size - 1, start + int(file_size/10) - 1)
    end = min(end, file_size - 1)
    if end < start:
        #end = file_size - 1
        end = min(file_size - 1, start + int(file_size/10) - 1)
    length = int(end - start + 1)
    if length < 0:
        print('invalid range')

    with open(path, 'rb') as fd:
        fd.seek(start)
        bytes = fd.read(length)
    assert len(bytes) == length

    response = Response(
        bytes,
        206,
        mimetype=mimetypes.guess_type(path)[0],
        direct_passthrough=True,
    )
    response.headers.add(
        'Content-Range', 'bytes {0}-{1}/{2}'.format(
            start, end, file_size,
        ),
    )
    response.headers.add(
        'Accept-Ranges', 'bytes'
    )
    return response

def get_range(request):
    range = request.headers.get('Range')
    m = re.match(r'bytes=(?P<start>\d+)-(?P<end>\d+)?', range)
    if m:
        start = m.group('start')
        end = m.group('end')
        start = int(start)
        if end is not None:
            end = int(end)
        return start, end
    else:
        return 0, None
    

def downloadUrls(yturls, dir_path = "download"):
    filesObj = {}
    errors = []
    for yturl in yturls:
        if yturl == '':
            continue
        try:
            yt = YouTube(yturl)
            audio = yt.streams.filter(only_audio=True).first()
            file_name = secure_filename(yt._title) + ".mp3"
            if not os.path.exists(dir_path):
                os.makedirs(dir_path)            
            out_file = dir_path +"/" + file_name
            audio.download(output_path=".", filename=out_file, skip_existing=False)
            file_name = yt._title + ".mp3"
            filesObj[file_name] = out_file
        except Exception as e:
            errors.append(yturl)
            continue
    return filesObj, errors

def sorted_alphanumeric(data):
    convert = lambda text: int(text) if text.isdigit() else text.lower()
    alphanum_key = lambda key: [ convert(c) for c in re.split('([0-9]+)', key) ] 
    return sorted(data, key=alphanum_key)

search_results = []
def search_items(path, search): 
    # Initialize the result dictionary with folder 
    # name, type, and an empty list for children 
    
  
    # Check if the path is a directory 
    if not os.path.isdir(path): 
        return #search_results 
  
    # Iterate over the entries in the directory 
    for entry in os.listdir(path): 
       # Create the full path for the current entry 
        entry_path = os.path.join(path, entry) 
  
        # If the entry is a directory, recursively call the function 
        if os.path.isdir(entry_path): 
            search_items(entry_path, search)
        # If the entry is a file, create a dictionary with name and type 
        else:
            if search in entry:
                filepath = os.path.join(path, entry)
                stat_res = os.stat(filepath)
                info = {}
                info['name'] = entry
                info['path'] = path[len(root)+1:]
                info['mtime'] = time_desc(stat_res.st_mtime) # stat_res.st_mtime
                info['mtimehuman'] = time_humanize(stat_res.st_mtime) # stat_res.st_mtime
                info['icon'] = icon_fmt(entry)
                ft = get_type(stat_res.st_mode)
                info['type'] = ft
                info['mtype'] = data_fmt(entry)
                sz = stat_res.st_size
                info['size'] = size_fmt(sz) #sz
                search_results.append(info) 
  
    return #search_results

def create_media_folder_structure_json(path): 
    # Initialize the result dictionary with folder 
    # name, type, and an empty list for children 
    result = {'name': (os.path.basename(path), '')[path==root], 
              'type': 'folder', 'children': []} 
  
    # Check if the path is a directory 
    if not os.path.isdir(path): 
        return result 
  
    # Iterate over the entries in the directory 
    for entry in sorted_alphanumeric(os.listdir(path)): 
       # Create the full path for the current entry 
        entry_path = os.path.join(path, entry) 
  
        # If the entry is a directory, recursively call the function 
        if os.path.isdir(entry_path): 
            if any(os.path.isdir(os.path.join(entry_path, fname)) for fname in os.listdir(entry_path)):
                child_dir = next((fname for fname in os.listdir(entry_path) if os.path.isdir(os.path.join(entry_path, fname))), None)
                if child_dir and any((data_fmt(sfname) == 'audio' or data_fmt(sfname) == 'video') for sfname in os.listdir(os.path.join(entry_path, child_dir))):
                    result['children'].append(create_media_folder_structure_json(os.path.join(entry_path)))
            else:
                if any((data_fmt(fname) == 'audio' or data_fmt(fname) == 'video') for fname in os.listdir(entry_path)):
                    result['children'].append(create_media_folder_structure_json(entry_path)) 
        # If the entry is a file, create a dictionary with name and type 
        else:
            if (data_fmt(entry) == 'audio' or data_fmt(entry) == 'video'):
                result['children'].append({'name': entry, 'type': 'file', 'mimetype': mimetypes.guess_type(entry_path)[0]}) 
  
    return result 

def create_music_folder_structure_json(path): 
    # Initialize the result dictionary with folder 
    # name, type, and an empty list for children 
    result = {'name': (os.path.basename(path), '')[path==root], 
              'type': 'folder', 'children': []} 
  
    # Check if the path is a directory 
    if not os.path.isdir(path): 
        return result 
  
    # Iterate over the entries in the directory 
    for entry in sorted_alphanumeric(os.listdir(path)): 
       # Create the full path for the current entry 
        entry_path = os.path.join(path, entry) 
  
        # If the entry is a directory, recursively call the function 
        if os.path.isdir(entry_path): 
            #if any(fname.endswith('.mp3') for fname in os.listdir(entry_path)):
            if any(os.path.isdir(os.path.join(entry_path, fname)) for fname in os.listdir(entry_path)):
                child_dir = next((fname for fname in os.listdir(entry_path) if os.path.isdir(os.path.join(entry_path, fname))), None)
                if child_dir and any(sfname.endswith('.mp3') or sfname.endswith('.m3u') for sfname in os.listdir(os.path.join(entry_path, child_dir))):
                    result['children'].append(create_music_folder_structure_json(os.path.join(entry_path)))
            else:
                if any(fname.endswith('.mp3') for fname in os.listdir(entry_path)):
                    result['children'].append(create_music_folder_structure_json(entry_path)) 
        # If the entry is a file, create a dictionary with name and type 
        else:
            if entry.endswith('.mp3') or entry.endswith('.m3u'):
                result['children'].append({'name': entry, 'type': 'file'}) 
  
    return result 

def create_folder_structure_json(path): 
    # Initialize the result dictionary with folder 
    # name, type, and an empty list for children 
    result = {'name': (os.path.basename(path), '')[path==root], 
              'type': 'folder', 'children': []} 
  
    # Check if the path is a directory 
    if not os.path.isdir(path): 
        return result 
  
    # Iterate over the entries in the directory 
    for entry in sorted_alphanumeric(os.listdir(path)): 
       # Create the full path for the current entry 
        entry_path = os.path.join(path, entry) 
  
        # If the entry is a directory, recursively call the function 
        if os.path.isdir(entry_path): 
            result['children'].append(create_folder_structure_json(entry_path)) 
  
    return result 

class PathView(MethodView):
    def get(self, p=''):
        hide_dotfile = request.args.get('hide-dotfile', request.cookies.get('hide-dotfile', 'no'))
        
        if p == 'gcleansearch':
            return render_template('gclean/index.html')
        
        if p == 'viewerJSODF/index.html':
            url_hash = request.url.split('#')
            if len(url_hash) == 2:
                hash = url_hash[1]
            return render_template('viewerJSODF/index.html')
        
        if p == 'audioplayer/index.html':
            dir_path = request.args.get('path')
            if dir_path:
                dir_path = dir_path.replace('/', '', 1)
            path = os.path.join(root, dir_path or '')
            path = os.path.normpath(path)
            if os.path.isdir(path):
                audio_files = []
                has_audio = False
                for filename in os.listdir(path):
                    filename_noext, ext = os.path.splitext(filename)
                    if ext in ignored:
                        continue
                    exts = datatypes.get('audio')
                    if filename.split('.')[-1] in exts:
                        audio_files.append(filename)
                        has_audio = True
                try:
                    audio_files = sorted(audio_files, key=lambda s: int(re.search(r'\d+', s).group()))
                except:
                    audio_files = sorted(audio_files)
                return render_template('/audioplayer/index.html', path=p, dir_path=path, audio_files=json.dumps(audio_files), has_audio=has_audio)
            
        if p == 'mediaplayer/index.html':
            dir_path = request.args.get('path')
            if dir_path:
                dir_path = dir_path.replace('/', '', 1)
            path = os.path.join(root, dir_path or '')
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
                    if data_type == 'audio' or data_type == 'video':
                        media_src['mimetype'] = mimetypes.guess_type(filename)[0]
                        media_src['name'] = filename
                        media_files.append(media_src)
                        has_audio = True
                return render_template('/mediaplayer/index.html', path=p, dir_path=path, media_files=json.dumps(media_files))
        
        if p == 'api/getLyrics':
            orig_title = request.args.get('title')
            full_path = request.args.get('path')
            app.logger.info('%s orig_title', orig_title)
            app.logger.info('%s full_path', full_path)
            if full_path:
                app.logger.info('%s full_path exists', full_path)
                if not full_path.startswith(root):
                    full_path = full_path.replace(request.host_url, '')
                    app.logger.info('%s proxy_url', proxy_url)
                    full_path = full_path.replace(proxy_url,'')
                    if full_path.startswith("/"):
                        full_path=full_path.replace('/', '', 1)
                    urlpattern = r"((http|https)\:\/\/)?[0-9\.\/\?\:@\-_=#]+\/+"
                    full_path = re.sub(urlpattern, '', full_path) #"((http|https)\:\/\/)?[0-9\.\/\?\:@\-_=#]+\/+"gm
                    app.logger.info('%s full_path replaced url', full_path)
                    app.logger.info('%s root', root)
                    full_path = os.path.join(root, full_path)
                    #full_path = root + full_path
                    app.logger.info('%s full_path joined root', full_path)
                    full_path = os.path.normpath(full_path)
                    app.logger.info('%s norm full_path', full_path)
                full_path_no_ext, ext = os.path.splitext(full_path)
                full_path = full_path_no_ext + '.lyr'
                app.logger.info('%s full_path as lyr', full_path)
            if os.path.exists(full_path):
                with open(full_path, encoding="utf-8") as f:
                    song = json.load(f)                
                result = {}
                result['lyrics']= song['lyrics']
                result['body'] = song['_body']
                if 'lyrics_ts' in song:
                    result['lyrics_ts'] = song['lyrics_ts']
                return json.dumps(result)
            else:
                title = orig_title.replace('_', ' ').replace('.mp3', '').replace('-','')
                title = re.sub(r'\d+\.', '', title).replace('/', ' ')
                title = title.lower().strip()
                for term in lyrics_excluded_terms:
                    if term in title:
                        title = title.replace(term, '').strip()
                        title = re.sub(r'\s+', ' ', title)
                genius = lyricsgenius.Genius(GENIUS_ACCESS_TOKEN, response_format='html', sleep_time=1.0, timeout=15, retries=3)
                song = genius.search_song(title=title, artist=title)
                if song != None and song.lyrics:
                    app.logger.info('%s song info returned', song.title)
                    if song.title.lower() == "Band Names".lower():
                        return {"status": 400, "error": "No lyrics found"}
                    _song = {}
                    _song['lyrics'] = song.lyrics
                    _song['_body'] = song._body
                    app.logger.info('%s writting song', song.title)
                    with open(full_path, 'w') as f:
                        json.dump(_song, f, indent=4)                    
                    result = {}
                    result['lyrics']= song.lyrics,
                    result['body'] = song._body
                    return json.dumps(result)
                else:
                    app.logger.info('%s no song returned')
                    result = {}
                    result['status'] = 400
                    result['error'] = "No lyrics found"
                    return json.dumps(result)
            
        if p == 'api/getMediaFolderTree':
            jsonTree =create_media_folder_structure_json(root)
            return jsonTree
        if p == 'api/getMusicFolderTree':
            jsonTree =create_music_folder_structure_json(root)
            return jsonTree
        if p == 'api/getFolderTree':
            jsonTree =create_folder_structure_json(root)
            return jsonTree
        if p == 'api/getPlaylistM3u':
            path = request.args.get('path')
            if not path or not path.endswith('.m3u'):
                return {"status": 400, "error": "No playlist found"}
            if path.startswith('/'):
                path = path.replace('/', '', 1)
            path = os.path.join(root, path)
            path = os.path.normpath(path)
            if os.path.exists(path):
                playlist = M3U.parse(path)
                return {"status": 200, "playlist": playlist}
            else:
                return {"status": 400, "error": "No playlist found"}
            
        path = os.path.join(root, p)
        path = os.path.normpath(path)
        if os.path.isdir(path):
            contents = []
            audio_files = []
            has_audio = False
            image_files = []
            has_image = False
            total = {'size': 0, 'dir': 0, 'file': 0}
            for filename in os.listdir(path):
                filename_noext, ext = os.path.splitext(filename)
                if ext in ignored:
                    continue
                """ if hide_dotfile == 'yes' and filename[0] == '.':
                    continue """
                filepath = os.path.join(path, filename)
                stat_res = os.stat(filepath)
                info = {}
                info['name'] = filename
                info['mtime'] = stat_res.st_mtime
                ft = get_type(stat_res.st_mode)
                info['type'] = ft
                total[ft] += 1
                sz = stat_res.st_size
                info['size'] = sz
                total['size'] += sz
                ext = filename.split('.')[-1]
                if(ext!=''):
                    audio_exts = datatypes.get('audio')
                    if ext in audio_exts:
                        audio_files.append(filename)
                        has_audio = True
                    image_exts = datatypes.get('image')
                    if ext in image_exts:
                        image_files.append(filename)
                        has_image = True
                contents.append(info)
            try:
                audio_files = sorted(audio_files, key=lambda s: int(re.search(r'\d+', s).group()))
            except:
                audio_files = sorted(audio_files)
            page = render_template('index.html', path=p, dir_path=path, contents=contents, total=total, audio_files=json.dumps(audio_files), has_audio=has_audio, image_files=json.dumps(image_files), has_image=has_image, ytad_url=ytad_url, hide_dotfile=hide_dotfile)
            res = make_response(page, 200)
            res.set_cookie('hide-dotfile', hide_dotfile, max_age=16070400)
        elif os.path.isfile(path):
            if 'stream' in request.args:
                def generate():
                    with open(path, "rb") as fwav:
                        data = fwav.read(1024)
                        while data:
                            yield data
                            data = fwav.read(1024)
                return Response(generate(), mimetype="audio/mpeg")
            else:
                if 'Range' in request.headers:
                    start, end = get_range(request)
                    res = partial_response(path, start, end)
                else:
                    if len(request.values)==0 or not request.values['download']:
                        res = send_file(path)
                    else:
                        res = send_file(path, as_attachment=True)
        else:
            res = make_response('Not found', 404)
        return res
    
    def put(self, p=''):
        if request.cookies.get('auth_cookie') == key:
            path = os.path.join(root, p)
            dir_path = os.path.dirname(path)
            Path(dir_path).mkdir(parents=True, exist_ok=True)

            info = {}
            if os.path.isdir(dir_path):
                try:
                    filename = secure_filename(os.path.basename(path))
                    with open(os.path.join(dir_path, filename), 'wb') as f:
                        f.write(request.stream.read())
                except Exception as e:
                    info['status'] = 'error'
                    info['msg'] = str(e)
                else:
                    info['status'] = 'success'
                    info['msg'] = 'File Saved'
            else:
                info['status'] = 'error'
                info['msg'] = 'Invalid Operation'
            res = make_response(json.JSONEncoder().encode(info), 201)
            res.headers.add('Content-type', 'application/json')
        else:
            info = {} 
            info['status'] = 'error'
            info['msg'] = 'Authentication failed'
            res = make_response(json.JSONEncoder().encode(info), 401)
            res.headers.add('Content-type', 'application/json')
        return res

    def post(self, p=''):
        res = None
        if request.cookies.get('auth_cookie') == key:
            path = os.path.join(root, p)

            info = {}
            if request.path == '/newfolder':
                path = os.path.join(path, request.form['path'])
                path = os.path.normpath(path)
                if os.path.isdir(path):
                    try:
                        newpath = os.path.join(path, request.form['foldername'].strip())
                        newpath = os.path.normpath(newpath)
                        os.mkdir(newpath, mode=0o777)
                        dir_path = newpath[len(root)+1:]
                        dir_path = dir_path.replace('\\', '/')
                    except Exception as e:
                        info['status'] = 'error'
                        info['msg'] = str(e)
                    return redirect(url_for('path_view', p=dir_path),302, json.JSONEncoder().encode(info))
            if request.path == '/movepath':
                opath = os.path.join(root, request.form['opath'])
                opath = os.path.normpath(opath)
                dpath = os.path.join(root, request.form['dpath'])
                dpath = os.path.normpath(dpath)
                if(os.path.exists(opath) and opath != dpath):
                    try:
                        if(os.path.isdir(opath)):
                            shutil.move(opath, dpath, copy_function = shutil.copytree)
                        else:
                            shutil.move(opath, dpath)
                    except Exception as e:
                        info['status'] = 'error'
                        info['msg'] = str(e)
                    else:
                        info['status'] = 'success'
                        info['msg'] = 'File Moved'
                        dir_path = dpath[len(root)+1:]
                        dir_path=dir_path[:-len(request.form['movepath_filename'])] #dir_path.replace(request.form['movepath_filename'],'')
                        dir_path = dir_path.replace('\\', '/')
                    return redirect(url_for('path_view', p=dir_path),302, json.JSONEncoder().encode(info))
                else:
                    info['status'] = 'error'
                    info['msg'] = 'Invalid Operation'
                    return redirect(url_for('path_view', p=dir_path),302, json.JSONEncoder().encode(info))
            if request.path == '/renamepath':
                opath = os.path.join(root, request.form['renamepath_opath'])
                opath = os.path.normpath(opath)
                renamepath_dpath = request.form['renamepath_dpath']
                filename = secure_filename(renamepath_dpath.split('/')[-1])
                path = renamepath_dpath[:-len(filename)]
                dpath = os.path.join(root, path, filename)
                dpath = os.path.normpath(dpath)
                dir_path = path
                if(os.path.exists(opath) and opath != dpath):
                    try:
                        os.rename(opath, dpath)
                        opath_ext = os.path.splitext(opath)[1]
                        if opath_ext == '.mp3':
                            opath_lyr = opath.replace(opath_ext, '.lyr')
                            if(os.path.exists(opath_lyr)):
                                os.rename(opath_lyr, dpath.replace(opath_ext, '.lyr'))
                    except Exception as e:
                        info['status'] = 'error'
                        info['msg'] = str(e)
                    else:
                        info['status'] = 'success'
                        info['msg'] = 'File Renamed'
                        '''dir_path = dpath[len(root)+1:]
                        dir_path = dir_path.replace('\\', '/')'''
                    return redirect(url_for('path_view', p=dir_path),302, json.JSONEncoder().encode(info))
                else:
                    info['status'] = 'error'
                    info['msg'] = 'Invalid Operation'
                    return redirect(url_for('path_view', p=dir_path),302, json.JSONEncoder().encode(info))
            
            elif request.path == '/api/':
                res_obj = {}
                yturls = list(map(str.strip, request.form["videos_urls"].split(',')))
                dir_path = os.path.join(root, request.form.get("path"))
                filesObj, errors = downloadUrls(yturls, dir_path)
                res_obj['status'] = 'success'
                res_obj['data'] = filesObj
                res_obj['errors'] = errors
                return redirect(url_for('path_view', p=request.form.get("path")),302, json.JSONEncoder().encode(res_obj))
            elif request.path == '/api/playlist/':
                res_obj = {}
                playlist_url = request.form.get("playlist_url")
                dir_path = os.path.join(root, request.form.get("path"))
                print(playlist_url)
                if not playlist_url:
                    res_obj['status'] = 'error'
                    res_obj['msg'] = "Empty playlist URL"
                    return redirect(url_for('path_view', p=request.form.get("path")),302, json.JSONEncoder().encode(res_obj))
                try:
                    playlist = Playlist(playlist_url)
                    videos = []
                    for url in playlist.video_urls:
                        print(url)
                        videos.append(url)
                    if not videos:
                        res_obj['status'] = 'error'
                        res_obj['msg'] = "Playlist is empty"
                        return redirect(url_for('path_view', p=request.form.get("path")),302, json.JSONEncoder().encode(res_obj))
                    yturls = ",".join(videos)
                    print(yturls)
                    filesObj, errors = downloadUrls(videos, dir_path) 
                    print(filesObj)
                    print(errors)
                    res_obj['status'] = 'success'
                    res_obj['data'] = filesObj
                    res_obj['errors'] = errors
                    return redirect(url_for('path_view', p=request.form.get("path")),302, json.JSONEncoder().encode(res_obj))
                except Exception as e:
                    import traceback
                    traceback.print_exc()
                    res_obj['status'] = 'error'
                    res_obj['msg'] = traceback.format_exc()
                    return redirect(url_for('path_view', p=request.form.get("path")),302, json.JSONEncoder().encode(res_obj))
            elif request.path == '/api/searchSong':
                title = request.form['title']
                artist = request.form['artist']
                full_path = request.form['full_path']
                if(full_path.startswith('/')):
                    full_path = full_path.replace('/', '', 1)
                full_path = os.path.join(root, full_path)
                full_path = os.path.normpath(full_path)
                full_path_no_ext, ext = os.path.splitext(full_path)
                full_path = full_path_no_ext + '.lyr'
                genius = lyricsgenius.Genius(GENIUS_ACCESS_TOKEN, response_format='html', sleep_time=1.0, timeout=15, retries=3)
                song = genius.search_song(title=title, artist=artist)
                if song != None and song.lyrics:
                    if song.title.lower() == "Band Names".lower():
                        return {"status": 400, "error": "No lyrics found"}
                    _song = {}
                    _song['lyrics'] = song.lyrics
                    _song['_body'] = song._body
                    with open(full_path, 'w') as f:
                        json.dump(_song, f, indent=4)                    
                    result = {}
                    result['lyrics']= song.lyrics,
                    result['body'] = song._body
                    return json.dumps(result)
                else:
                    result = {}
                    result['status'] = 400
                    result['error'] = "No lyrics found"
                    return json.dumps(result)
            elif request.path == '/api/genPlaylistM3u':
                res_obj = {}
                playlist_obj = json.loads(request.form.get("playlist_obj")) #request.form.get("playlist_obj")
                dest_path = os.path.join(root, request.form.get("path"))
                print(playlist_obj)
                try:
                    M3U.create(playlist_obj, dest_path)
                    res_obj['status'] = 'success'
                    return res_obj
                except Exception as e:
                    import traceback
                    traceback.print_exc()
                    res_obj['status'] = 'error'
                    res_obj['msg'] = traceback.format_exc()
                    return res_obj
            elif request.path == '/api/search':
                search = request.form.get("search")
                path = os.path.join(root, request.form['path'])
                path = os.path.normpath(path)
                if os.path.isdir(path):
                    try:
                        global search_results
                        search_results = []
                        search_items(path, search)
                    except Exception as e:
                        print(e)
                        return {'status': 'error', 'msg': str(e)}
                try:
                    return {'status': 'success', 'results': search_results}
                except Exception as e:
                    return {'status': 'error', 'msg': str(e)}
            else:
                Path(path).mkdir(mode=0o777, parents=True, exist_ok=True)
                if os.path.isdir(path):
                    files = request.files.getlist('files[]')
                    for file in files:
                        try:
                            filename = secure_filename(file.filename)
                            file.save(os.path.join(path, filename))
                        except Exception as e:
                            info['status'] = 'error'
                            info['msg'] = str(e)
                        else:
                            info['status'] = 'success'
                            info['msg'] = 'File Saved'
                else:
                    info['status'] = 'error'
                    info['msg'] = 'Invalid Operation'
                res = make_response(json.JSONEncoder().encode(info), 200)
                res.headers.add('Content-type', 'application/json')
        else:
            info = {} 
            info['status'] = 'error'
            info['msg'] = 'Authentication failed'
            res = make_response(json.JSONEncoder().encode(info), 401)
            res.headers.add('Content-type', 'application/json')
        return res
    
    def delete(self, p=''):
        if request.cookies.get('auth_cookie') == key:
            path = os.path.join(root, p)
            dir_path = os.path.dirname(path)
            Path(dir_path).mkdir(parents=True, exist_ok=True)

            info = {}
            if os.path.isdir(dir_path):
                try:
                    filename = secure_filename(os.path.basename(path))
                    full_path = os.path.join(dir_path, filename)
                    """ if not os.listdir(full_path):
                        full_path = os.path.join(full_path, "d.txt")
                        f = open(os.path.join(full_path, "w")) """
                    if(filename != ''):
                        os.remove(full_path)
                    else:
                        shutil.rmtree(dir_path)
                except Exception as e:
                    info['status'] = 'error'
                    info['msg'] = str(e)
                    print(e)
                else:
                    info['status'] = 'success'
                    info['msg'] = 'File Deleted'
            else:
                info['status'] = 'error'
                info['msg'] = 'Invalid Operation'
            res = make_response(json.JSONEncoder().encode(info), 204)
            res.headers.add('Content-type', 'application/json')
        else:
            info = {}
            info['status'] = 'error'
            info['msg'] = 'Authentication failed'
            res = make_response(json.JSONEncoder().encode(info), 401)
            res.headers.add('Content-type', 'application/json')
        return res

path_view = PathView.as_view('path_view')
app.add_url_rule('/', view_func=path_view)
app.add_url_rule('/<path:p>', view_func=path_view)
app.add_url_rule('/newfolder', view_func=path_view)

if __name__ == '__main__':
    from config import BIND, PORT, KEY
    key = KEY
    app.run(BIND, PORT, threaded=True, debug=False)
