from flask import jsonify
import json
import bcrypt
import os
import uuid

notepaddb = {}


def create_database():
    global notepaddb
    if not os.path.exists("ffsdb.json"):
        notepaddb = {"users": {}}
        with open("ffsdb.json", "w") as f:
            json.dump(notepaddb, f, indent=4)
    else:
        with open("ffsdb.json", "r") as f:
            notepaddb = json.load(f)


def register_user(request):
    global notepaddb
    username = request.form["username"]
    password = request.form["password"]
    userId = str(uuid.uuid4())
    try:
        for userId, user in notepaddb["users"].items():
            if user["username"] == username:
                if  bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
                    return jsonify({"message": "Logged sucessfully", "user": user}), 200
                else:
                    return jsonify({"message": "Forbidden"}), 403

        bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        notepaddb["users"][userId]={"userId": userId, "username": username, "password": hashed_password, "lastNoteId": 0, "notes": {}}
        with open("ffsdb.json", "w") as f:
            json.dump(notepaddb, f, indent=4)

    except Exception as e:
        print(e)
    finally:
        return jsonify({"message": "User registered successfully", "user": notepaddb["users"][userId]})


# @app.route('/notepad/note', methods=['POST'])
def saveNote(request):
    global notepaddb
    noteName = request.form["noteName"]
    noteContent = request.form["noteContent"]
    userId = request.form["userId"]

    noteId = request.form.get("noteId")
    if noteId is None:
        noteId = str(int(notepaddb["users"][userId]["lastNoteId"])+1)
        note = {"id": noteId}
        note["noteName"] = noteName
        note["noteContent"] = noteContent
        notepaddb["users"][userId]["notes"][noteId]=note
        notepaddb["users"][userId]["lastNoteId"] = noteId
        with open("ffsdb.json", "w") as f:
            json.dump(notepaddb, f, indent=4)
        return jsonify({"message": "Note saved successfully", "noteId": noteId})
    else:
        note = notepaddb["users"][userId]["notes"][noteId]
        note["noteName"] = noteName
        note["noteContent"] = noteContent
        notepaddb["users"][userId]["notes"][noteId]=note
        with open("ffsdb.json", "w") as f:
            json.dump(notepaddb, f, indent=4)
        return jsonify({"message": "Note saved successfully", "noteId": noteId})

def removeNote(request):
    global notepaddb
    noteId = request.values.get("noteId")
    userId = request.values.get("userId")
    notepaddb["users"][userId]["notes"].pop(noteId)
    with open("ffsdb.json", "w") as f:
        json.dump(notepaddb, f, indent=4)
    return jsonify({"message": "Note removed successfully"})

def loadNotes(request):
    global notepaddb
    userId = request.values.get("userId")
    notes = []
    if "notes" in notepaddb["users"][userId] and notepaddb["users"][userId]["notes"]:
        for noteId, note in notepaddb["users"][userId]["notes"].items():
            notes.append({"id": noteId, "noteName": note["noteName"]})
    return notes


def loadNote(request):
    global notepaddb
    userId = request.values.get("userId")
    noteId = request.values.get("noteId")
    return notepaddb["users"][userId]["notes"][noteId]