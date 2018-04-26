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

### Installing
Install BITS with instructions from README at https://github.com/LGSInnovations/bits<br />
Install bits-weather-dashboard as a BITS module from https://github.com/callie-jones/bits-weather-dashboard


## Running Tests
Tests will be run automatically when running bits-weather-dashboard with bits.<br />


## Deployment
Deploy in the BITS directory with: <br />
sudo npm run build<br />
sudo npm run dev<br />
Navigate to the weather-dashboard tab on the side toolbar of https://localhost:9001

## Built With
BITS framework<br />
ChartJS
