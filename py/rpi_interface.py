import time
import json
import os
import requests
import serial
import threading

# region Startup

# read config
dir_path = os.path.dirname(os.path.realpath(__file__))
config_path = os.path.realpath(f"{dir_path}/config.json")
print(f"Reading config from {config_path}")
f = open(config_path)
config = json.load(f)
f.close()

# open serial port
port_name = config["port"]["name"]
baud_rate = config["port"]["baud_rate"]
ser = serial.Serial(port_name, baud_rate)
if ser.is_open:
    ser.close()
    ser.open()
print(ser.name)

# endregion // Startup

# region Files


def to_credentials(email, password):
    return {
        "email": email,
        "password": password
    }


def read_credentials():
    email = config['account']['email']
    password = config['account']['password']
    print(f"Found credentials: {email}")
    return to_credentials(email, password)


# endregion // Files


# region API

def url(route):
    return f"{config['api']}/{route}"


def authenticate(credentials):
    r = requests.post(url("users/auth"), data=credentials)
    status = r.reason

    if status == "OK":
        customerId = json.loads(r.text)["_id"]
        print(f"Authenticate: Successful - Customer ID: {customerId}")
    else:
        customerId = None
        print(f"Authenticate: Unable to authenticate - Status: {status}")

    return customerId


def get_billerId():
    r = requests.get(url("others/biller"))
    status = r.reason

    if status == "OK":
        billerId = json.loads(r.text)["_id"]
        print(f"Get Biller ID: Successful - Biller ID: {billerId}")
    else:
        billerId = None
        print(f"Get Biller ID: Unable to get biller ID - Status: {status}")

    return billerId


def addBill(customerId, billerId):
    # r = requests.get(url("users/5fcb2558fd513cc5b22e9b06"))
    # print(r.text)
    print("Adding Bill")
    print(customerId, billerId)

# endregion API

# region AIS


def match(shipLocation, portLocation):
    return True


# endregion // AIS


# region Main

def on_event():
    # print("From print_time", time.time())
    line = str(ser.readline().decode("utf-8").strip())
    print("on_event:", line)


def set_interval(func, sec):
    def func_wrapper():
        set_interval(func, sec)
        func()
    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t


def start_listener():
    print("Start Listener")
    set_interval(on_event, 1)


def main():
    credentials = read_credentials()
    customerId = authenticate(credentials)
    billerId = get_billerId()

    if customerId != None and billerId != None:
        if match:
            addBill(customerId, billerId)
            start_listener()
    else:
        print("Invalid Username/Password... Please Check credentials")
        return


if __name__ == "__main__":
    print("RPI Interface: Started...")
    # main()
    start_listener()


# region //Main
