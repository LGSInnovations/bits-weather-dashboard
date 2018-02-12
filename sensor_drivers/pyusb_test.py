import usb.core
import usb.util
import sys

#dev = usb.core.find(find_all=True)

#for cfg in dev:
#    sys.stdout.write('Decimal VendorID=' + str(cfg.idVendor) + ' & ProductID=' + str(cfg.idProduct) + '\n')
#    sys.stdout.write('Hexadecimal VendorID=' + hex(cfg.idVendor) + ' & ProductID=' + hex(cfg.idProduct) + '\n\n')


# Thermometer:
#   Decimal VendorID=3141 & ProductID=29697
#   Hexadecimal VendorID=0xc45 & ProductID=0x7401

device = usb.core.find(idVendor=0xc45, idProduct=0x7401)
device.reset()

#print(device.bLength)
#print(device.bNumConfigurations)
#print(device.bDeviceClass)

device.set_configuration()

endpoint = device[0][(0,0)][0]

data = None
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



