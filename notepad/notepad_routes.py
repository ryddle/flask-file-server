from flask import Blueprint, request, render_template
from notepad.notepad_methods import loadNote, saveNote, removeNote, loadNotes, register_user

notepad = Blueprint('notepad', __name__)

''' Notepad BP '''
@notepad.route("/", methods=["GET"])
def notepadRoot():
     return render_template("/index.html")
 
@notepad.route("/index.html", methods=["GET"])
def notepadIndex():
     return render_template("/notepad/index.html")
 
@notepad.route("/login", methods=["POST"])
def login():
    return register_user(request)

@notepad.route("/note/", methods=["GET"])
def loadNoteRoute():
    return loadNote(request)

@notepad.route("/note/", methods=["POST"])
def saveNoteRoute():
    return saveNote(request)

@notepad.route("/note/", methods=["DELETE"])
def removeNoteRoute():
    return removeNote(request)

@notepad.route("/notes/", methods=["GET"])
def loadNotesRoute():
    return loadNotes(request)