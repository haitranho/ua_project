import requests

BASE_URL = "http://127.0.0.1:5000"

response = requests.put(BASE_URL + "/audio", {
    "audioURL1": "https://firebasestorage.googleapis.com/v0/b/modio-45f92.appspot.com/o/instrumental.wav?alt=media&token=b90295e5-42cf-40bd-b71e-0ea1ecd1cd61",
    "audioURL2": "https://firebasestorage.googleapis.com/v0/b/modio-45f92.appspot.com/o/voice.wav?alt=media&token=7d6997c3-9cb7-4ebf-bfc9-4503e3f73f70", 
})
print(response.json())
# input()
# response = requests.delete(BASE_URL + "/audio/a1b2")
# print(response)
# input()
# response = requests.get(BASE_URL + "/audio/a1b2")
# print(response.json())