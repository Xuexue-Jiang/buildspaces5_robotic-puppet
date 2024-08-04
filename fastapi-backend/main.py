import asyncio
import uvicorn
from fastapi import FastAPI, WebSocket, Request
from bleak import BleakClient, BleakScanner, BleakError

app = FastAPI()

audio_queue = asyncio.Queue()

@app.get("/")
async def read_root():
    return {"Hello": "World"}

async def scan_bluetooth_devices(timeout=30.0):
    print(f"Scanning for Bluetooth devices for {timeout} seconds...")
    devices = await BleakScanner.discover(timeout=timeout)
    print("Bluetooth devices found:", devices)
    return devices

@app.get("/scan")
async def scan():
    devices = await scan_bluetooth_devices()
    return [{"name": device.name, "address": device.address} for device in devices if device.name is not None]

@app.get("/find_device/{device_name}")
async def find_device(device_name: str, timeout: float = 30.0):
    device_name = device_name.lower()
    devices = await scan_bluetooth_devices(timeout=timeout)
    for device in devices:
        if device.name and device_name in device.name.lower():
            return {"name": device.name, "address": device.address}
    return {"error": "Device not found"}

async def discover_services_and_characteristics(address):
    async with BleakClient(address) as client:
        await client.connect()
        services = await client.get_services()
        service_dict = {}
        for service in services:
            characteristics = []
            for char in service.characteristics:
                characteristics.append({
                    "uuid": char.uuid,
                    "properties": char.properties
                })
            service_dict[service.uuid] = characteristics
        return service_dict

@app.get("/discover/{device_address}")
async def discover(device_address: str):
    services = await discover_services_and_characteristics(device_address)
    return services

@app.post("/write/{device_address}/{service_uuid}/{char_uuid}")
async def write(device_address: str, service_uuid: str, char_uuid: str, data: str, request: Request):
    data = await request.json()
    await write_to_characteristic(device_address, service_uuid, char_uuid, data['data'])
    return {"status": "Data written successfully"}

async def write_to_characteristic(address, service_uuid, char_uuid, data):
    async with BleakClient(address) as client:
        await client.connect()
        print(f"Connected to {address}")
        await client.write_gatt_char(char_uuid, bytearray(data, 'utf-8'))
        print(f"Data written to characteristic {char_uuid}")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Connection established")
    try:
        while True:
            data = await websocket.receive_bytes()
            print(f"Received data: {len(data)} bytes")
            await websocket.send_text(f"Received {len(data)} bytes")
            await audio_queue.put(data)
    except Exception as e:
        print(f"Connection error: {e}")
        await websocket.close()

def normalize_string(s):
    return s.replace('’', "'").strip()


# async def send_audio_to_bluetooth():
#     print("Connecting to Bluetooth device...")
#     device_name = "SuperSnowva"
#     device = await find_bluetooth_device(device_name)
#     print("Bluetooth device found =", device)
#     if device:
#         async with BleakClient(device) as client:
#             try:
#                 await client.connect()
#                 print("Device connected")
#                 services = await client.get_services()  # Explicitly discover services
#                 print('client =', client)
#                 print(f"Services = {services.services}")

#                 writable_char = None

#                 for service in services:
#                     print(f"Service {service.uuid}: {service.description}")
#                     print(f"Service attributes: {dir(service)}")
#                     for char in service.characteristics:
#                         print(f"Characteristic {char.uuid} properties: {char.properties}")
#                         print(f"Characteristic attributes: {dir(char)}")
#                         if "write" in char.properties or "write without response" in char.properties:
#                             print(f"Found writable characteristic: {char.uuid}")
#                             writable_char = char
#                             break
#                     if writable_char:
#                         break

#                 if writable_char:
#                     while True:
#                         audio_chunk = await audio_queue.get()  # Await the queue.get coroutine
#                         # Ensure the data is in the correct format
#                         if not isinstance(audio_chunk, bytes):
#                             audio_chunk = bytes(audio_chunk)
#                         try:
#                             await client.write_gatt_char(writable_char.uuid, audio_chunk)
#                             audio_queue.task_done()
#                             print(f"Sent data to {writable_char.uuid}")
#                         except BleakError as e:
#                             print(f"Failed to write to characteristic: {e}")
#                         if audio_queue.empty():
#                             break
#                 else:
#                     print("No writable characteristic found")
#             except BleakError as e:
#                 print(f"Error connecting to Bluetooth device: {e}")
#     else:
#         print("Bluetooth device not found")


# async def find_bluetooth_device(device_name):
#     device_name = normalize_string(device_name)
#     print("Scanning for Bluetooth devices...")
#     devices = await BleakScanner.discover()
#     print("Bluetooth devices found = ", devices)

#     for device in devices:
#         print(f"Device : ", device)
#         if device.name is not None:
#             print('device.address = ', device.address)
#             device_name_str = normalize_string(str(device.name))
#             if device_name == device_name_str:
#                 # print(f"Matched device: {device_name}")
#                 return device
#     return None


# async def scan(timeout=30.0):
#     print("Scanning for Bluetooth devices...")
#     devices = await BleakScanner.discover(timeout=timeout)
#     print("Bluetooth devices found: ", devices)
#     for device in devices:
#         print(f"Device: {device.name}, Address: {device.address}")


# @app.on_event("startup")
# async def startup_event():
#     asyncio.create_task(send_audio_to_bluetooth())


if __name__ == "__main__":
    # loop = asyncio.get_event_loop()
    # loop.run_until_complete(scan())
    # loop.create_task(send_audio_to_bluetooth())
    uvicorn.run(app, host="0.0.0.0", port=8000)