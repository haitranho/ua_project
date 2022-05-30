from flask import Flask, Response
from flask_restful import Resource, reqparse
import os
import requests
from pyrebase import pyrebase
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Firebase Configurations
firebaseConfig = {
    "apiKey": "AIzaSyA7iwtXCRcyWID9qWec8W12tpZ23OGlgso",
    "authDomain": "modio-45f92.firebaseapp.com",
    "databaseURL": "https://modio-45f92.firebaseio.com",
    "projectId": "modio-45f92",
    "storageBucket": "modio-45f92.appspot.com",
    "messagingSenderId": "955895092133",
    "appId": "1:955895092133:web:3151813ec451aa03028e4c",
    "measurementId": "G-VJE8RZMEDC"
}

firebase = pyrebase.initialize_app(firebaseConfig)
storage = firebase.storage()
path_on_cloud = "/audio/overlayed_audio.wav"

# db = firebase.database()
# Firebase Storage Initialization
# firebaseStorage = pyrebase.initialize_app(firebaseConfig)
# cloudStorage = firebaseStorage.storage()

# Arguments for a PUT request
audio_put_args = reqparse.RequestParser()
audio_put_args.add_argument(
    "audioURL1", type=str, help="URL 1 of the audio is required", required=True)
audio_put_args.add_argument(
    "audioURL2", type=str, help="URL 2 of the audio is required", required=True)

@app.before_request
def before():
    print("Request recieved.")

@app.after_request
def set_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    return response

# Controllers


@app.route('/audio', methods=['PUT'])
def put():
    print("PUT STARTED")
    fileName = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
    args = audio_put_args.parse_args()
    r1 = requests.get(args["audioURL1"], allow_redirects=True)
    r2 = requests.get(args["audioURL2"], allow_redirects=True)
    open('the_instrumental.wav', 'wb').write(r1.content)
    open('the_voiceover.wav', 'wb').write(r2.content)
    os.system("ffmpeg -i the_instrumental.wav -i the_voiceover.wav -filter_complex amix=inputs=2:duration=longest overlayed_audio.wav -y")
    # os.system("ffmpeg -i the_instrumental.wav -i the_voiceover.wav -filter_complex amerge=inputs=2 -ac 2 overlayed_audio.wav -y")
    # Store overlayed_audio.wav into firebase
    storage.child("/audio/" + fileName).put("overlayed_audio.wav")
    return Response(response=fileName, status=200)


if __name__ == "__main__":
    app.run(debug=True)
