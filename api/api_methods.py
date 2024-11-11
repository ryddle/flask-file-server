import os
import stat
import re
from flask import Response
from werkzeug.utils import secure_filename
import mimetypes
from pytube import YouTube
from cosntants import *
from filters import *
from config import root

def get_type(mode):
    if stat.S_ISDIR(mode) or stat.S_ISLNK(mode):
        type = "dir"
    else:
        type = "file"
    return type


def partial_response(path, start, end=None):
    file_size = os.path.getsize(path)

    if end is not None:
        if start > end:
            start, end = 0, file_size - 1
    if end is None:
        end = file_size - 1
    end = min(end, file_size - 1)
    if end < start:
        end = file_size - 1
    length = int(end - start + 1)
    if length < 0:
        print("invalid range")

    def generate():
        with open(path, "rb") as fd:
            fd.seek(start)
            while True:
                chunk = fd.read(1024 * 1024 * 10)  # read 10MB chunks
                if not chunk:
                    break
                yield chunk

    response = Response(
        generate(),
        206,
        mimetype=mimetypes.guess_type(path)[0],
        direct_passthrough=True,
    )
    response.headers.add(
        "Content-Range",
        "bytes {0}-{1}/{2}".format(
            start,
            end,
            file_size,
        ),
    )
    response.headers.add("Accept-Ranges", "bytes")
    return response


def get_range(request):
    range = request.headers.get("Range")
    m = re.match(r"bytes=(?P<start>\d+)-(?P<end>\d+)?", range)
    if m:
        start = m.group("start")
        end = m.group("end")
        start = int(start)
        if end is not None:
            end = int(end)
        return start, end
    else:
        return 0, None


def downloadUrls(yturls, dir_path="download"):
    filesObj = {}
    errors = []
    for yturl in yturls:
        if yturl == "":
            continue
        try:
            yt = YouTube(yturl)
            audio = yt.streams.filter(only_audio=True).first()
            file_name = secure_filename(yt._title) + ".mp3"
            if not os.path.exists(dir_path):
                os.makedirs(dir_path)
            out_file = dir_path + "/" + file_name
            audio.download(output_path=".", filename=out_file, skip_existing=False)
            file_name = yt._title + ".mp3"
            filesObj[file_name] = out_file
        except Exception as e:
            errors.append(yturl)
            continue
    return filesObj, errors


def sorted_alphanumeric(data):
    convert = lambda text: int(text) if text.isdigit() else text.lower()
    alphanum_key = lambda key: [convert(c) for c in re.split("([0-9]+)", key)]
    return sorted(data, key=alphanum_key)


search_results = []


def search_items(path, search):
    # Initialize the result dictionary with folder
    # name, type, and an empty list for children

    # Check if the path is a directory
    if not os.path.isdir(path):
        return  # search_results

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
                info["name"] = entry
                info["path"] = path[len(root) + 1 :]
                info["mtime"] = time_desc(stat_res.st_mtime)  # stat_res.st_mtime
                info["mtimehuman"] = time_humanize(
                    stat_res.st_mtime
                )  # stat_res.st_mtime
                info["icon"] = icon_fmt(entry)
                ft = get_type(stat_res.st_mode)
                info["type"] = ft
                info["mtype"] = data_fmt(entry)
                sz = stat_res.st_size
                info["size"] = size_fmt(sz)  # sz
                search_results.append(info)

    return  # search_results


def create_media_folder_structure_json(path):
    # Initialize the result dictionary with folder
    # name, type, and an empty list for children
    result = {
        "name": (os.path.basename(path), "")[path == root],
        "type": "folder",
        "children": [],
    }

    # Check if the path is a directory
    if not os.path.isdir(path):
        return result

    # Iterate over the entries in the directory
    for entry in sorted_alphanumeric(os.listdir(path)):
        # Create the full path for the current entry
        entry_path = os.path.join(path, entry)

        # If the entry is a directory, recursively call the function
        if os.path.isdir(entry_path):
            if any(
                os.path.isdir(os.path.join(entry_path, fname))
                for fname in os.listdir(entry_path)
            ):
                child_dir = next(
                    (
                        fname
                        for fname in os.listdir(entry_path)
                        if os.path.isdir(os.path.join(entry_path, fname))
                    ),
                    None,
                )
                if child_dir and any(
                    (data_fmt(sfname) == "audio" or data_fmt(sfname) == "video")
                    for sfname in os.listdir(os.path.join(entry_path, child_dir))
                ):
                    result["children"].append(
                        create_media_folder_structure_json(os.path.join(entry_path))
                    )
            else:
                if any(
                    (data_fmt(fname) == "audio" or data_fmt(fname) == "video")
                    for fname in os.listdir(entry_path)
                ):
                    result["children"].append(
                        create_media_folder_structure_json(entry_path)
                    )
        # If the entry is a file, create a dictionary with name and type
        else:
            if data_fmt(entry) == "audio" or data_fmt(entry) == "video":
                result["children"].append(
                    {
                        "name": entry,
                        "type": "file",
                        "mimetype": mimetypes.guess_type(entry_path)[0],
                    }
                )

    return result


def create_music_folder_structure_json(path):
    # Initialize the result dictionary with folder
    # name, type, and an empty list for children
    result = {
        "name": (os.path.basename(path), "")[path == root],
        "type": "folder",
        "children": [],
    }

    # Check if the path is a directory
    if not os.path.isdir(path):
        return result

    # Iterate over the entries in the directory
    for entry in sorted_alphanumeric(os.listdir(path)):
        # Create the full path for the current entry
        entry_path = os.path.join(path, entry)

        # If the entry is a directory, recursively call the function
        if os.path.isdir(entry_path):
            # if any(fname.endswith('.mp3') for fname in os.listdir(entry_path)):
            if any(
                os.path.isdir(os.path.join(entry_path, fname))
                for fname in os.listdir(entry_path)
            ):
                child_dir = next(
                    (
                        fname
                        for fname in os.listdir(entry_path)
                        if os.path.isdir(os.path.join(entry_path, fname))
                    ),
                    None,
                )
                if child_dir and any(
                    sfname.endswith(".mp3") or sfname.endswith(".m3u")
                    for sfname in os.listdir(os.path.join(entry_path, child_dir))
                ):
                    result["children"].append(
                        create_music_folder_structure_json(os.path.join(entry_path))
                    )
            else:
                if any(fname.endswith(".mp3") for fname in os.listdir(entry_path)):
                    result["children"].append(
                        create_music_folder_structure_json(entry_path)
                    )
        # If the entry is a file, create a dictionary with name and type
        else:
            if entry.endswith(".mp3") or entry.endswith(".m3u"):
                result["children"].append({"name": entry, "type": "file"})

    return result


def create_folder_structure_json(path):
    # Initialize the result dictionary with folder
    # name, type, and an empty list for children
    result = {
        "name": (os.path.basename(path), "")[path == root],
        "type": "folder",
        "children": [],
    }

    # Check if the path is a directory
    if not os.path.isdir(path):
        return result

    # Iterate over the entries in the directory
    for entry in sorted_alphanumeric(os.listdir(path)):
        # Create the full path for the current entry
        entry_path = os.path.join(path, entry)

        # If the entry is a directory, recursively call the function
        if os.path.isdir(entry_path):
            result["children"].append(create_folder_structure_json(entry_path))

    return result