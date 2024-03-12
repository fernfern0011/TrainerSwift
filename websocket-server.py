import asyncio
import websockets
import pymongo

#intialise mongodb
mongodb_client = pymongo.MongoClient("mongodb://localhost:27017")
db = mongodb_client["websocket_chat"]
collection = db["chats"]


#insert client message
async def save_chat(client_info, message):
    try:
        result = collection.insert_one({"client_info":client_info,"message":message})
        print("Message saved successfully")
    except Exception as e:
        print(f"Error saving message to MongoDB: {e}")

#validate client message
async def create_zoom(message):
    if message == "Create Zoom Link":
        return "replace w zoom link"
    else:
        return "Invalid command"

#handle client message
async def handle_client(websocket, path):
    async for message in websocket:
        message = eval(message)
        client_info = message[0]
        text_message = message[1]
        await save_chat(client_info, text_message)
        response = await create_zoom(text_message)
        await websocket.send(response)


#create socket
async def main():
    server = await websockets.serve(handle_client, "localhost", 8765)
    run = server.sockets[0].getsockname()
    print("WebSocket server started at", run)
    await asyncio.Future()

asyncio.run(main())