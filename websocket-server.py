import asyncio
import websockets
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import json

#intialise mongodb
uri = "mongodb+srv://dbadmin:dbadmin123@websocket-chat.olkapp7.mongodb.net/?retryWrites=true&w=majority&appName=websocket-chat"
client = MongoClient(uri, server_api=ServerApi('1'))

#test connection
try:
    client.admin.command("ping")
    print("Connected to MongoDB")
except Exception as e:
    print(e)

db = client["websocket_chat"]
collection = db["chats"]


#insert client message
async def save_chat(sender_info,receiver_info, message):
    try:
        result = collection.insert_one({"sender_info":sender_info,"receiver_info":receiver_info,"message":message})
        print("Message saved successfully")
    except Exception as e:
        print(f"Error saving message to MongoDB: {e}")

#validate client message
async def send_message(message):
    if message == "connection created":
        print("first connection successful")
        return "first connection successful"
    else:
        print("prior connection available")
        return "prior connection available"

#handle client message
async def handle_client(websocket, path):
    async for message in websocket:
        #message = eval(message)
        message = message.split(",")
        print(message)
        sender_info = message[0]
        receiver_info = message[1]
        text_message = message[2]
        await save_chat(sender_info,receiver_info, text_message)
        response = await send_message(text_message)
        await websocket.send(response)

        relevant_convo = []
        for doc in collection.find({"sender_info": sender_info, "receiver_info": receiver_info}):
            doc["_id"] = str(doc["_id"])
            relevant_convo.append(doc)
        for doc in collection.find({"sender_info": receiver_info, "receiver_info": sender_info}):
            doc["_id"] = str(doc["_id"])
            relevant_convo.append(doc)
        print(relevant_convo,len(relevant_convo))
        if len(relevant_convo) > 0:
            await websocket.send(json.dumps(relevant_convo))    
    


#validate client message
async def send_message(message):
    if message == "connection created":
        print("first connection successful")
        return "first connection successful"
    else:
        print("prior connection available")
        return "prior connection available"        
        


#create socket
async def main():
    server = await websockets.serve(handle_client, "0.0.0.0", 8765)
    run = server.sockets[0].getsockname()
    await asyncio.Future()
    return ("WebSocket server started at", run)
    

asyncio.run(main())