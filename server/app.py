# pip install flask
# pip install flask-RESTful
# pip install requests
from flask import Flask
from flask_restful import Api, Resource, reqparse

app = Flask(__name__)
api = Api(app)

# Arguments for a PUT request
audio_put_args = reqparse.RequestParser()
audio_put_args.add_argument("name", type=str, help="Name of the audio is required", required=True)
audio_put_args.add_argument("views", type=int, help="Views of the audio")
audio_put_args.add_argument("likes", type=int, help="Likes on the audio")

audioList = {}

# Controllers
class Audio(Resource):
    def get(self, audioID):
        if audioID not in audioList:
            return {"message": "Audio not found"}, 404
        return audioList[audioID], 200

    def put(self, audioID):
        if audioID in audioList:
            return {"message": "Audio already exists"}, 409
        args = audio_put_args.parse_args()
        audioList[audioID] = args
        return audioList[audioID], 201

    def delete(self, audioID):
        if audioID not in audioList:
            return {"message": "Audio not found"}, 404
        del audioList[audioID]
        return "", 204 

# Routes
api.add_resource(Audio, "/audio/<string:audioID>")

if __name__ == "__main__":
    app.run(debug=True)
