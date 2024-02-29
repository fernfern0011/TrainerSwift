import asyncio
import websockets

#validate client message
async def create_zoom(message):
    if message == "Create Zoom Link":
        return "replace w zoom link"
    else:
        return "Invalid command"

#handle client message
async def handle_client(websocket, path):
    async for message in websocket:
        response = await create_zoom(message)
        await websocket.send(response)

#create socket
async def main():
    server = await websockets.serve(handle_client, "localhost", 8765)
    run = server.sockets[0].getsockname()
    print("WebSocket server started at", run)
    await asyncio.Future()

asyncio.run(main())