import asyncio
import websockets

#create connection + send message
async def connect(message):
    async with websockets.connect("ws://localhost:8765") as websocket:
        await websocket.send(message)
        response = await websocket.recv()
        print("Received", repr(response))

#test 
async def main():
    await connect("Create Zoom Link")
    await connect("hello")

asyncio.run(main())