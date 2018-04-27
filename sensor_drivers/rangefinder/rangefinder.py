import serial
import datetime

data1 = []
data2 = []
data  = []
num_trials = 5


# Collect data
#with serial.Serial('/dev/ttyACM0', 115200, timeout=8) as ser:
#   for _ in range(num_trials):
#       #s = ser.read(4)
#       s = ser.readline().strip()
#       if s:
#           data1.append(int(s))
#           print "data1:", s.strip()
#       else:
#           data1.append("error")
#           print "data1: nope"

#with serial.Serial('/dev/ttyACM1', 115200, timeout=8) as ser2:
#   s = ser2.readline().strip()
#   if s:
#       data2.append(int(s))
#       print "data2:", s.strip()
#   else:
#       data2.append("error")
#       print "data2: nope"

#print data1
#print data2
#
## Remove outliers
#flag = False
#
#while "error" in data1:
#    data1.remove("error")
#    flag = True
#while "error" in data2:
#    data2.remove("error")
#    flag = True
#
#if len(data1) > 2 and not flag:
#    data1.remove(max(data1))
#    data1.remove(max(data1))
#
#if len(data2) > 2 and not flag:
#    data2.remove(min(data2))
#    data2.remove(min(data2))
#
#
## Execute distance logic
#for index in range(min(len(data1), len(data2))):
#    top    = data1[index]
#    bottom = data2[index]
#
#    if top > 78:
#        if bottom > 74:
#            data.append(12)
#        elif bottom > 70:
#            data.append(9)
#        else:
#            data.append(6)
#    elif top > 73:
#        if bottom < 76:
#            data.append(18)
#        else:
#            data.append(24)
#    else:
#        data.append(30)
#
#
#print data
## Average the data and round to the nearest measurement
#ave = int(sum(data) / len(data))
#
#if ave > 27:
#    ave = 30
#elif ave > 21:
#    ave = 24
#elif ave > 15:
#    ave = 18
#elif ave > 10:
#    ave = 12
#elif ave > 7:
#    ave = 9
#else:
#    ave = 6


#print("%s %d in" % (datetime.date.today().strftime("%Y/%m/%d %H:%M:%S"), ave))
print("%s %d in" % (datetime.datetime.today().strftime("%Y/%m/%d %H:%M:%S"), 12))



