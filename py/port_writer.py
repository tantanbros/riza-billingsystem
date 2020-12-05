import serial
import threading


def set_interval(func, sec):
    def func_wrapper():
        set_interval(func, sec)
        func()
    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t


if __name__ == "__main__":
    ser = serial.Serial('COM3')
    if ser.is_open:
        ser.close()
        ser.open()
    print(ser.name)

    def write():
        ser.write(b"hatdog\n")
        print("Wrote: hatdog")

    set_interval(write, 1)
