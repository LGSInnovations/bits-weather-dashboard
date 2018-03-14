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

      // Time in milliseconds
      this.temperatureTimeDelay = 5000;
      this.pressureTimeDelay = 1000;
      this.weightTimeDelay = 5000;

      this.temperatureRedundantFile = path.join(__dirname, 'backups/__temperatureRecords.csv');
      this.weightRedundantFile = path.join(__dirname, 'backups/__weightRecords.csv');

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
    temperatureDriver(crudManager, redundantFile) {
      // Requires compiled executable of temperature sensor code
      // TODO: Add documentation describing binary compilation process or push binary to master

      // TODO: Pull out this filepath into class variables or pass as argument
      filePath = '../bits-weather-dashboard/sensor_drivers/thermometer/pcsensor';
      exec('.' + filePath,
        function(error, stdout, stderr) {
          //Use for debugging
          //console.log("stdout=",stdout);
          //console.log("stderr=",stderr);
          //console.log("error=",error);
          if(!error) {
              var split_str = String(stdout).trim().split(" ");
              //assert(split_str.length == 5, "Thermometer string is incorrectly formatted: " + stdout);
              var date        = split_str[0];
              var time        = split_str[1];
              //var fahrenheit  = split_str[3].slice(0, -1);
              var celsius     = split_str[4].slice(0, -1);
              var jsonObj = {'date': date, 'time': time, 'celsius': celsius};
              //assert(date.length == 10, "Date is incorrectly formatted: " + date);
              //assert(time.length ==  8, "Time is incorrectly formatted: " + time);
              crudManager.storeData(jsonObj); // TODO: Add error handling on fail

              fs.writeFile(redundantFile, JSON.stringify(jsonObj)+'\n', (err) => {
                if (err) throw err;
                //console.log('Temperature reading backed up: ', jsonObj);
              });
              console.log('Temperature sensor recorded: ', jsonObj);
          } else {
              var fdate = '2014/10/30'
              var ftime = '07:00:36'
              var fcelsius = '23.31'
              var data = {'date': fdate, 'time': ftime, 'celsius': fcelsius};

              crudManager.storeData(data); // TODO: Add error handling on fail

              fs.appendFile(redundantFile, JSON.stringify(data)+'\n', (err) => {
                if (err) throw err;
                //console.log('Fake temperature reading backed up: ', data);
              });
              console.log('FAKE: Temperature sensor recorded: ', data);
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



    // Stub for temp driver
    // Returns JSON object to store
    weightDriver(crudManager, redundantFile) {
      // Requires compiled executable of temperature sensor code
      // TODO: Add documentation describing binary compilation process or push binary to master

      // TODO: Pull out this filepath into class variables or pass as argument
      filePath = '../bits-weather-dashboard/sensor_drivers/scale/scale.py';
      exec('python3 ' + filePath,
        function(error, stdout, stderr) {
          //Use for debugging
          //console.log("stdout=",stdout);
          //console.log("stderr=",stderr);
          //console.log("error=",error);
          if(!error) {
              var split_str = String(stdout).trim().split(" ");
              //assert(split_str.length == 5, "Thermometer string is incorrectly formatted: " + stdout);
              var date        = split_str[0];
              var time        = split_str[1];
              var weight     = split_str[2];
              var jsonObj = {'date': date, 'time': time, 'weight': weight};
              crudManager.storeData(jsonObj); // TODO: Add error handling on fail

              fs.writeFile(redundantFile, JSON.stringify(jsonObj)+'\n', (err) => {
                if (err) throw err;
                //console.log('Temperature reading backed up: ', jsonObj);
              });
              console.log('Weight sensor recorded: ', jsonObj);
          } else {
              var fdate = '2014/10/30'
              var ftime = '07:00:36'
              var fweight = '0.00'
              var data = {'date': fdate, 'time': ftime, 'weight': fweight};

              crudManager.storeData(data); // TODO: Add error handling on fail

              fs.appendFile(redundantFile, JSON.stringify(data)+'\n', (err) => {
                if (err) throw err;
                //console.log('Fake temperature reading backed up: ', data);
              });
              console.log('FAKE: Weight sensor recorded: ', data);
          }
      });
    }




    // Generic looping function, used by each sensor
    loopReadDataFromFile(crudManager, driverFunction, timeDelay, redundantFile) {
      driverFunction(crudManager, redundantFile);
      setTimeout(this.loopReadDataFromFile.bind(this), timeDelay, crudManager, driverFunction, timeDelay, redundantFile);
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
      .then(() => this.loopReadDataFromFile(this._temperatureCrudManager, this.temperatureDriver, this.temperatureTimeDelay, this.temperatureRedundantFile))
      //.then(() => this.loopReadDataFromFile(this._pressureCrudManager, this.pressureDriver, this.pressureTimeDelay))
      .then(() => this.loopReadDataFromFile(this._weightCrudManager, this.weightDriver, this.weightTimeDelay, this.weightRedundantFile));
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
