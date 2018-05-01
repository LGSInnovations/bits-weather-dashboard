# Members
Sam Anoff  
Jack Dinkel  
Kelsey Dowd  
Derek Gorthy  
Callie Jones

# Smart Ski Slope 

System of fog nodes to display real time temperature, humidity, and barometer sensor data on a user-friendly dashboard.
This system allows for collection and processing of data over a limited-internet area on a ski slope or other user destination.<br />
Users can view the data of each sensor individually, history of each sensor, or an overview of all of the data.<br />
Currently implemented:<br />
Rangefinder<br />
Thermometer<br />
Pressure sensor<br />

## Getting Started
Read the README at https://github.com/LGSInnovations/bits<br />
Download dependencies and development version of npm


### Dependencies
In addition to dependencies of BITS, user also must have<br />
MongoDB bits module: https://github.com/LGSInnovations/bits-mongodb<br />
bits-weather-dashboard<br />
bits-settings: https://github.com/LGSInnovations/bits-settings<br />
pyUSB: https://github.com/pyusb/pyusb<br />

### Installing
Install BITS with instructions from README at https://github.com/LGSInnovations/bits<br />
Install bits-weather-dashboard as a BITS module from https://github.com/callie-jones/bits-weather-dashboard


## Running Tests
Tests will be run automatically when running bits-weather-dashboard with bits.<br />


## Sensors
A total of three sensors were used for this project, a thermometer, scale, and microbit. A barometer was also experimented with. All sensor drivers can be located at `sensor_drivers/`.

### Thermometer
The thermometer used was a [TEMPer2 Thermometer](https://www.amazon.com/Thermometer-Hygrometer-Temperature-Recorder-Windows/dp/B00QES0UXO). The drivers are located in `sensor_drivers/thermometer`, which is a clone of `petervojtek`'s [`usb-thermometer`](https://github.com/petervojtek/usb-thermometer) git repository. Installation instructions can be found in its [README](https://github.com/callie-jones/bits-weather-dashboard/tree/master/sensor_drivers/thermometer).

### Scale
The scale used was a [100 lb Dymo Digital Shipping Scale](https://www.amazon.com/DYMO-Digital-Shipping-25-pound-1772059/dp/B0053HCP8K/ref=redir_mobile_desktop?_encoding=UTF8&ref_=redir_mdp_mobile&th=1). The drivers are located in `sensor_drivers/scale/scale.py`. This driver was written from scratch in python3.4 using the [pyUSB](https://github.com/pyusb/pyusb) library.

### Microbit
Three [microbits](http://microbit.org/) were used to simulate a rangefinder or depth sensor. The microbits were designated `Top`, `Bottom`, and `Send`. The `Top` microbit sat at the theoretical maximum snow height, and the `Bottom` sat at the zero height location. The `Send` microbit sat between the other two on a slidable arm that could be moved up and down, toward either of the other sensors. The `Send` microbit sent out a bluetooth pulse at regular intervals, which would be recieved by the `Top` and `Bottom`. The `Top` and `Bottom` sensors would then write the strength of the signal to serial. Both the source code and compiled microbit code can be found in `sensor_drivers/microbit/`.

The serial strength values are interpreted using the python2.7 script found at `sensor_drivers/microbit/microbit.py`. This script combines the strength values from both the `Top` and `Bottom` microbits to estimate the approximate height of the `Send` microbit using an experimentally found algorithm.

### Barometer
The project also experimented with the Cygnal Integrated Products [HT163 Barometer](https://www.newfrog.com/product/ht-163-barometric-pressure-temperature-humidity-data-logger-recorder-usb-interface-electronic-barometer-thermometer-hygrometer-125018?currency=USD&gclid=EAIaIQobChMIn-HE-uS61wIVR4F-Ch2CaA3IEAkYCCABEgKlkvD_BwE). Unfortunately, no linux drivers could be found, and attempts to write one from scratch failed.


## Deployment
Deploy in the BITS directory with: <br />
sudo npm run build<br />
sudo npm run dev<br />
Navigate to the weather-dashboard tab on the side toolbar of https://localhost:9001

## Built With
BITS framework<br />
ChartJS

