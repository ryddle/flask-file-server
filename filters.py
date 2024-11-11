from datetime import datetime
import humanize
from cosntants import datatypes, icontypes

# @app.template_filter()
def caps(text):
    """Converts a string to all caps"""
    return text.upper()

# @app.template_filter()
def trim_whitespace(text):
    """Removes leading and trailing whitespace from a string"""
    return text.strip()

# @app.template_filter("size_fmt")
def size_fmt(size):
    return humanize.naturalsize(size)


# @app.template_filter("time_fmt")
def time_desc(timestamp):
    mdate = datetime.fromtimestamp(timestamp)
    str = mdate.strftime("%Y-%m-%d %H:%M:%S")
    return str


# @app.template_filter("data_fmt")
def data_fmt(filename):
    t = "unknown"
    for type, exts in datatypes.items():
        if filename.split(".")[-1] in exts:
            t = type
    return t


# @app.template_filter("has_audio")
def has_audio(filename):
    t = False
    for exts in datatypes.items():
        if filename.split(".")[-1] in exts:
            t = True
    return t


# @app.template_filter("icon_fmt")
def icon_fmt(filename):
    i = "fa-file-o"
    for icon, exts in icontypes.items():
        if filename.split(".")[-1] in exts:
            i = icon
    return i


# @app.template_filter("humanize")
def time_humanize(timestamp):
    mdate = datetime.fromtimestamp(timestamp)
    return humanize.naturaltime(mdate)