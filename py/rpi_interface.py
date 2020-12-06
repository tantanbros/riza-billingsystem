import time
import json
import os
import requests
import threading
import xml.etree.ElementTree as et
import shutil
import ntpath
import uuid

# region Startup

# read config
dir_path = os.path.dirname(os.path.realpath(__file__))
config_path = os.path.realpath(f"{dir_path}/config.json")
data_path = os.path.realpath(f"{dir_path}/data")
live_path = os.path.realpath(f"{data_path}/live")
tmp_path = os.path.realpath(f"{data_path}/tmp")

print(f"--> Setting up configurations <--")
print(f"Data Directory: {data_path}")
print(f"Live Directory: {live_path}")
print(f"Tmp Directory: {tmp_path}")
print(f"Reading config: {config_path}")
f = open(config_path)
config = json.load(f)
f.close()

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


# Gets all ship records per file
def parse_xml(file):
    print(f"Parsing ship xml file: {file}")

    tree = et.parse(file)
    root = tree.getroot()

    ships = []
    for item in root.findall("./rtept"):
        ship = {
            "name": item.find("name").text,
            "time": item.find("time").text,
            "lat": item.attrib["lat"],
            "lon": item.attrib["lon"]
        }
        ships.append(ship)

    return ships


def path_leaf(path):
    head, tail = ntpath.split(path)
    return tail or ntpath.basename(head)


# Get all ship records of multiple files
def parse_ships_xml(shipPaths):
    shipRecords = []
    for shipPath in shipPaths:
        # Parse each ship xml record
        record = parse_xml(shipPath)
        shipRecords.append(record)

        # once it's parsed, move it from live to tmp directory
        filename = path_leaf(shipPath)
        newPath = f"{tmp_path}/{uuid.uuid4()}-{filename}"
        shutil.move(shipPath, newPath)

    return shipRecords


def create_data_paths():
    if not os.path.exists(data_path):
        os.mkdir(data_path)

    if not os.path.exists(live_path):
        os.mkdir(live_path)

    if not os.path.exists(tmp_path):
        os.mkdir(tmp_path)


def read_live_records():
    create_data_paths()

    # get all files in live directory and get its full path
    shipPaths = []
    files = os.listdir(live_path)
    for file in files:
        shipPath = os.path.realpath(f"{live_path}/{file}")
        shipPaths.append(shipPath)

    print(f"Found {len(shipPaths)} Ship Records : {shipPaths}")

    return shipPaths

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


def get_description(shipRecord):
    return f"{shipRecord['name']} - lat: {shipRecord['lat']}, lon: {shipRecord['lon']}"


def get_invoice_details(shipRecord):
    print("Getting Invoice Details")

    billingItems, totalAmount = [], 0

    for item in shipRecord:
        descirption = get_description(item)
        price = float(config["price"])
        totalAmount += price

        billingItem = {
            "description": descirption,
            "amount": str(price)
        }

        billingItems.append(billingItem)

    return (billingItems, totalAmount)


def add_bill(customerId, billerId, shipRecord):
    print(f"\n--> Adding Bill to Customer: {customerId} <--")

    (billingItems, totalAmount) = get_invoice_details(shipRecord)
    invoice_dict = {
        "customer": customerId,
        "biller": billerId,
        "billingItems": billingItems,
        "totalAmount": totalAmount,
    }

    invoice = json.dumps(invoice_dict)

    print("Invoice Created - Sending Bill to API")

    invoiceUrl = f"{config['api']}/invoices"
    headers = {
        "content-type": "application/json"
    }
    print(f"Requesting to url: {invoiceUrl}")
    r = requests.post(invoiceUrl, data=invoice, headers=headers)

    # response = json.loads(r.text)
    # print(json.dumps(response, indent=4, sort_keys=True))

    status_code = r.status_code
    reason = r.reason
    print(f"Server responses with Status {status_code}: {reason}")

    if status_code == 200:
        print("Invoice Successfully Created...")
    else:
        print("Invoice Failed to be Created...")

# endregion API

# region AIS


def match(shipLocation, portLocation):
    return True


# endregion // AIS


# region Main

def set_interval(func, sec):
    def func_wrapper():
        set_interval(func, sec)
        func()
    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t


def main():
    print("\n###################################")
    print("# New Ship Record Reading Session #")
    print("-----------------------------------\n")

    print("--> Reading Credentials <--")
    credentials = read_credentials()
    customerId = authenticate(credentials)
    billerId = get_billerId()

    print("\n--> Reading Ship Records <--")

    if customerId != None and billerId != None:
        # get all files in the live records directory
        shipPaths = read_live_records()

        # parse live records to ship records
        shipRecords = parse_ships_xml(shipPaths)

        # create bill for each ship record parsed
        for shipRecord in shipRecords:
            add_bill(customerId, billerId, shipRecord)
    else:
        print("Invalid Username/Password... Please Check credentials")
        return


def start_main():
    interval = int(config['interval'])
    print(f"Reading live ship records: Every {interval} seconds\n")
    set_interval(main, interval)


if __name__ == "__main__":
    print("\nRPI Interface: Started...")
    start_main()

# region //Main
