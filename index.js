/**
Copyright 2017 LGS Innovations

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/

(() => {
  'use strict';

  const TemperatureCrudManager = require('./lib/crud-manager/temperature-crud-manager.js');
  const PressureCrudManager = require('./lib/crud-manager/pressure-crud-manager.js');
  const WeightCrudManager = require('./lib/crud-manager/weight-crud-manager.js');
  
  const TemperatureSettingsManager = require('./lib/settings-manager/ts-manager.js');

  var path       = require('path'),
      fs         = require('fs'),
      exec       = require('child_process').exec,
      filePath   = path.join(__dirname, 'data.csv'),
      scriptName = path.join(__dirname, 'example_executable.py'),
      assert     = require('assert');




  class App {

    constructor() {
      this._temperatureCrudManager = new TemperatureCrudManager();
      this._pressureCrudManager = new PressureCrudManager();
      this._weightCrudManager = new WeightCrudManager();
      
      this._temperatureSettingsManager = new TemperatureSManager();

      this.temperatureTimeDelay = 5000;
      this.pressureTimeDelay = 1000;
      this.weightTimeDelay = 50000;

      this.filePath = path.join(__dirname, 'data.csv');
    }

    changeTemperatureTimeDelay(newTemperatureTimeDelay) {
      this.temperatureTimeDelay = newTemperatureTimeDelay;
    }

    changePressureTimeDelay(newPressureTimeDelay) {
      this.pressureTimeDelay = newPressureTimeDelay;
    }

    changeWeightTimeDelay(newWeightTimeDelay) {
      this.weightTimeDelay = newWeightTimeDelay;
    }

    // Stub for temp driver
    // Returns JSON object to store
    temperatureDriver(crudManager,settingsManager) {
      var temperatureSensorExecutable = './pcsensor';

      // TODO: Add actual file path
      filePath = '/../bits-weather-dashboard/sensor_drivers/thermometer/pcsensor';
      exec('.' + filePath,
        function(error, stdout, stderr) {
          /** Use for debugging
          console.log(stdout);
          console.log(stderr);
          **/
          if(!error){
            var split_str = String(stdout).trim().split(" ");
            console.log("PATAAAATH",filePath);
            console.log("STOUUUUT",stdout);
            console.log("stdeerrr",stderr);
            console.log("STUUUFF",split_str);
            //assert(split_str.length == 5, "Thermometer string is incorrectly formatted: " + stdout);

            var date        = split_str[0];
            var time        = split_str[1];
            //var fahrenheit  = split_str[3].slice(0, -1);
            var celsius     = split_str[4].slice(0, -1);

            //assert(date.length == 10, "Date is incorrectly formatted: " + date);
            //assert(time.length ==  8, "Time is incorrectly formatted: " + time);

            var jsonObj = {'date': date, 'time': time, 'celsius': celsius};
            crudManager.storeData(jsonObj);
            settingsManager.setTempReading(celsius);
            console.log('Logged temperature reading: ', jsonObj);
          } else {
            var fdate = '2014/10/30';
            var ftime = '07:00:36';
            var fcelsius = '23.31'; 
            var data = {'date': fdate, 'time': ftime, 'celsius': fcelsius};
            crudManager.storeData(data);
            settingsManager.setTempReading(celsius);
            console.log("Logging fake reading:",data);
            
          }
      });
    }

    // Stub for pressure driver
    // Returns JSON object to store
    pressureDriver(crudManager) {
      var dt = new Date();  // Improve this section, creating new object on every entry
      var utcDate = dt.toUTCString();
      console.log('Logging pressure reading. Current time: ', utcDate);

      // TODO: Add call to pressure sensor here
      var pressure = '12 psi'
      var jsonObj = {'timestamp': utcDate, 'pressure': pressure};
    }

    // Stub for weight driver
    // Returns JSON object to store
    weightDriver(crudManager) {
      var dt = new Date();  // Improve this section, creating new object on every entry
      var utcDate = dt.toUTCString();
      console.log('Logging weight reading. Current time: ', utcDate);

      // TODO: Add call to weight sensor here
      var weight = '50 lbs'
      var jsonObj = {'timestamp': utcDate, 'pressure': weight};
    }

    // Generic looping function, used by each sensor
    loopReadDataFromFile(crudManager, settingsManager, driverFunction, timeDelay) {
      driverFunction(crudManager,settingsManager);
      setTimeout(this.loopReadDataFromFile.bind(this), timeDelay, crudManager, settingsManager, driverFunction, timeDelay);
    }

    readDataFromFile(callback) {
      var content;
      fs.readFile(self.filePath, function read(err, data) {
        if (err) {
          throw err;
        }
        content = data;
        callback(data); // TODO: Replace this line with crudManager.storeData() when ported into driver
      });
    }

    load(messageCenter) {
      this._temperatureCrudManager.load(messageCenter);
      this._pressureCrudManager.load(messageCenter);
      this._weightCrudManager.load(messageCenter);
      return Promise.resolve()
      .then(() => console.log('Loaded Weather Dashboard Module!'))
      .then(() => this.loopReadDataFromFile(this._temperatureCrudManager, this._temperatureSettingsManager, this.temperatureDriver, this.temperatureTimeDelay));
      //.then(() => this.loopReadDataFromFile(this._pressureCrudManager, this.pressureDriver, this.pressureTimeDelay))
      //.then(() => this.loopReadDataFromFile(this._weightCrudManager, this.weightDriver, this.weightTimeDelay));
    }

    unload() {
      return Promise.resolve()
      .then(() => console.log(this._temperatureCrudManager.unload(messageCenter)))
      .then(() => console.log(this._pressureCrudManager.unload(messageCenter)))
      .then(() => console.log(this._weightCrudManager.unload(messageCenter)));
    }
  }

  module.exports = new App();
})();
