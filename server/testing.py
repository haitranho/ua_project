import requests

BASE_URL = "http://127.0.0.1:5000"

response = requests.put(BASE_URL + "/audio/a1b2", {"name": "family ties", "views": 44, "likes": 10})
print(response.json())
input()
response = requests.get(BASE_URL + "/audio/a1b2")
print(response.json())
input()
response = requests.delete(BASE_URL + "/audio/a1b2")
print(response)
input()
response = requests.get(BASE_URL + "/audio/a1b2")
print(response.json())