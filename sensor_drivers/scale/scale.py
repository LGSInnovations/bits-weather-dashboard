#!/usr/bin/python
import time
import usb.core
import usb.util
import datetime
from sys import exit

# DYMO 100 lbs
VENDOR_ID = 0x0922
PRODUCT_ID = 0x8009

# Find the USB device
dev = usb.core.find(idVendor=VENDOR_ID,
                       idProduct=PRODUCT_ID)

def main():
    try:
        # Was device found?
        if dev is None:
            print("Device not found")
            exit()
        else:
            # Deactivate other drivers
            interface = 0
            if dev.is_kernel_driver_active(interface) is True:
                dev.detach_kernel_driver(interface)

                # Use the default configuration
                dev.set_configuration()
                usb.util.claim_interface(dev, interface)

            listen()

    except KeyboardInterrupt as e: 
        exit()


def grab():
    try:
        # Set first endpoint
        endpoint = dev[0][(0,0)][0]

        # Read a data packet. Try 10 times before failure.
        attempts = 10
        data = None
        while data is None and attempts > 0:
            try:
                data = dev.read(endpoint.bEndpointAddress,
                                endpoint.wMaxPacketSize)
            except usb.core.USBError as e:
                data = None
                if e.args == ('Operation timed out',):
                    attempts -= 1
                    #print("timed out... trying again")
                    if attempts < 1:
                        print('Timed out')
                    continue
        return data

    except usb.core.USBError as e:
        print("USBError:", str(e.args))
        exit()
    except IndexError as e:
        print("IndexError:", str(e.args))
        exit()


def listen():
    DATA_MODE_KG  = 3
    DATA_MODE_LBS = 12

    data = grab()

    # Interpret data
    if data != None:
        raw_weight = (data[4] + (data[5] * 256)) / 10.0
        if data[2] != DATA_MODE_LBS:
            print("Data is not in lbs")
            exit()
        
        print("%s %.1f lbs" % (datetime.date.today().strftime("%Y/%m/%d %H:%M:%S"), raw_weight))
    else:
        print("Error grabbing data")



main()
