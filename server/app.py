from flask import Flask
from flask_restful import Api, Resource, reqparse
import os
import requests
# import pyrebase

app = Flask(__name__)
api = Api(app)

# Firebase Configurations
# firebaseConfig = {
#     "apiKey": "AIzaSyA7iwtXCRcyWID9qWec8W12tpZ23OGlgso",
#     "authDomain": "modio-45f92.firebaseapp.com",
#     "projectId": "modio-45f92",
#     "storageBucket": "modio-45f92.appspot.com",
#     "messagingSenderId": "955895092133",
#     "appId": "1:955895092133:web:3151813ec451aa03028e4c",
#     "measurementId": "G-VJE8RZMEDC"
# }

# Firebase Storage Initialization
# firebaseStorage = pyrebase.initialize_app(firebaseConfig)
# cloudStorage = firebaseStorage.storage()

# Arguments for a PUT request
audio_put_args = reqparse.RequestParser()
audio_put_args.add_argument("audioURL1", type=str, help="URL 1 of the audio is required", required=True)
audio_put_args.add_argument("audioURL2", type=str, help="URL 2 of the audio is required", required=True)

# audioList = {}

# Controllers
class Audio(Resource):
    def put(self):
        args = audio_put_args.parse_args()
        r1 = requests.get(args["audioURL1"], allow_redirects=True)
        r2 = requests.get(args["audioURL2"], allow_redirects=True)
        open('the_instrumental.wav', 'wb').write(r1.content)
        open('the_voiceover.wav', 'wb').write(r2.content)
        os.system("ffmpeg -i the_instrumental.wav -i the_voiceover.wav -filter_complex amerge=inputs=2 -ac 2 overlayed_audio.wav")
        # Store overlayed_audio.wav into firebase
        # cloudStorage.child("overlayed_audio.wav").put("overlayed_audio.wav")
        return {"Overlayed Audio": "Success"}, 200

    # def put(self, audioID):
    #     if audioID in audioList:
    #         return {"message": "Audio already exists"}, 409
    #     args = audio_put_args.parse_args()
    #     audioList[audioID] = args
    #     return audioList[audioID], 201

    # def delete(self, audioID):
    #     if audioID not in audioList:
    #         return {"message": "Audio not found"}, 404
    #     del audioList[audioID]
    #     return "", 204 

# Routes
api.add_resource(Audio, "/audio")

if __name__ == "__main__":
    app.run(debug=True)
