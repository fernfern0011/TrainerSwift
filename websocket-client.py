import asyncio
import websockets
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json

app=Flask(__name__)
CORS(app)

relevant_chats = {}

@app.route('/websocketchat', methods=['POST'])
def websocketchat():
    data = request.get_json()
    print(data)

    #create connection + send message
    async def connect(message):
        async with websockets.connect("ws://localhost:8765") as websocket:
            await websocket.send(message)
            response = await websocket.recv()
            print("Received", repr(response))
            chat_history = await websocket.recv()
            if (chat_history):
                parsed_data = json.loads(chat_history)
                print("Received chat history")
                for doc in parsed_data:
                    print(doc)
                relevant_chats.update({"chats":parsed_data})
                print(relevant_chats)
    #test 
    async def main():
        nonlocal data
        if data["traineeID"].isnumeric() == True:
            data["traineeID"] = str("trainee" + data["traineeID"])
        if data["trainerID"].isnumeric() == True:
            data["trainerID"] = str("trainer" + data["trainerID"])

        if (data["connection"] == True):
            print(data)
            await connect([data["traineeID"]+","+ data["trainerID"]+","+"connection created"])
        else:
            if data["sender"] == "trainee":
                await connect([data["traineeID"]+","+ data["trainerID"]+","+data["message"]])
            else:
                await connect([data["trainerID"]+","+ data["traineeID"]+","+data["message"]])

    asyncio.run(main())
    return jsonify({"response": "success"})


@app.route('/getchats', methods=['GET'])
def getchats():
    global relevant_chats
    return jsonify(relevant_chats)

if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) + " for creating websocket.")
    app.run(host="0.0.0.0", port=5000, debug = True)