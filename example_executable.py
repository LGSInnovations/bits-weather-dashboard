import os, subprocess
curr = os.getcwd()
dirs = os.chdir(curr+'../bits-weather-dashboard/sensor_drivers/thermometer/')
p = subprocess.Popen(['./pcsensor'],cwd=dirs)
p.wait()
#print("2014/10/30 07:00:36 Temperature 73.96F 23.31C")
