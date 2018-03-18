import usb.core
import usb.util
import sys

#dev = usb.core.find(find_all=True)

#for cfg in dev:
#    sys.stdout.write('Decimal VendorID=' + str(cfg.idVendor) + ' & ProductID=' + str(cfg.idProduct) + '\n')
#    sys.stdout.write('Hexadecimal VendorID=' + hex(cfg.idVendor) + ' & ProductID=' + hex(cfg.idProduct) + '\n\n')


# Good Thermometer:
#   Decimal VendorID=3141 & ProductID=29697
#   Hexadecimal VendorID=0xc45 & ProductID=0x7401
#
# Bad Thermometer:
#   Decimal VendorID= & ProductID=
#   Hexadecimal VendorID=0x413d & ProductID=0x2107
#
vendor_id  = 0x0c45
product_id = 0x7401
vendor_id  = 0x413d
product_id = 0x2107


device = usb.core.find(idVendor=vendor_id, idProduct=product_id)


if device:
    #device.reset()

    #print(device.bLength)
    #print(device.bNumConfigurations)
    #print(device.bDeviceClass)

    # Override existing drivers
    c = 1
    for config in device:
        print('config:', c)
        print('Interfaces:', config.bNumInterfaces)
        print("configvalue:", config.bConfigurationValue)
        print("descriptor:", usb.util.find_descriptor(config, find_all=True, bInterfaceNumber=1))
        for interface in config:
            print("interface number:", interface.bInterfaceNumber)
            print("alternate setting:", interface.bAlternateSetting)
            for endpt in interface:
                print("endpoint address:", endpt.bEndpointAddress)
        for i in range(config.bNumInterfaces):
            if device.is_kernel_driver_active(i):
                device.detach_kernel_driver(i)
            print("Detached kernel driver", i)
        c+= 1

    device.set_configuration()
    usb.util.claim_interface(device, 0)

    endpoint = device[0][(0,0)][0]
    print("endpoint", endpoint)

    attempts = 10
    data = None
    while data is None and attempts > 0:
        try:
            data = device.read(endpoint.bEndpointAddress, endpoint.wMaxPacketSize)
        except usb.core.USBError as e:
            data = None
            if 'Operation timed out' in e.args:
                attempts -= 1
                print("Timed out... trying again")
                continue

    print(data)



    #while True:
    #try:
    print(endpoint)
    data = device.read(endpoint.bEndpointAddress,
                       endpoint.wMaxPacketSize, 1)
    RxData = ''.join([chr(x) for x in data])
    print(RxData)
    
    #except usb.core.USBError as e:
    #  data = None
    #  if e.args == ('Operation timed out',):
    #    continue

    usb.util.dispose_resources(device)

    
else:
    print("No device found")


