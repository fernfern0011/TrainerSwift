import asyncio
import websockets
from flask import Flask, request, jsonify
from flask_cors import CORS

app=Flask(__name__)
CORS(app)

@app.route('/websocketchat', methods=['POST'])
def websocketchat():
    data = request.get_json()

    #create connection + send message
    async def connect(message):
        async with websockets.connect("ws://localhost:8765") as websocket:
            await websocket.send(message)
            response = await websocket.recv()
            print("Received", repr(response))

    #test 
    async def main():
        if (data["connection"] == True):
            await connect(data["traineeid"], "connection created")
            await connect(data["trainerid"],"connection created")
        else:
            await connect(data["traineeid"], "test message")
            await connect(data["trainerid"], "test message")

    asyncio.run(main())

if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) + " for creating websocket.")
    app.run(host="0.0.0.0", port=5000, debug = True)