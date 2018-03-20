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
  
  const TemperatureSettingsManager = require('./lib/settings-manager/temperature-settings-manager.js');
  const PressureSettingsManager = require('./lib/settings-manager/pressure-settings-manager.js');
  const WeightSettingsManager = require('./lib/settings-manager/weight-settings-manager.js');
  
  var path       = require('path'),
      fs         = require('fs'),
      exec       = require('child_process').exec,
      filePath   = path.join(__dirname, 'data.csv'),
      scriptName = path.join(__dirname, 'example_executable.py'),
      assert     = require('assert');


  class App {

    constructor() {

      //// STUB DRIVER CONTROLS:
      //    Set to true to read fake values from stub drivers
      //    Set to false to read real values from sensors and turn on error handling
      this.temperature_stub_driver_on = true;
      this.weight_stub_driver_on      = true;
      /////

      this._temperatureCrudManager = new TemperatureCrudManager();
      this._pressureCrudManager = new PressureCrudManager();
      this._weightCrudManager = new WeightCrudManager();
      
      this._temperatureSettingsManager = new TemperatureSettingsManager();
      this._pressureSettingsManager = new PressureSettingsManager();
      this._weightSettingsManager = new WeightSettingsManager();
      
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

    // Returns JSON object to store
    temperatureDriver(crudManager, settingsManager, redundantFile) {
      // Requires compiled executable of temperature sensor code
      // TODO: Add documentation describing binary compilation process or push binary to master
      
      // Return fake readings
      if (this.temperature_stub_driver_on) {
          var fdate = '2014/10/30'
          var ftime = '07:00:36'
          var fcelsius = '23.31'
          var fjsonObj = {'date': fdate, 'time': ftime, 'celsius': fcelsius};

          crudManager.storeData(fjsonObj); // TODO: Add error handling on fail
          settingsManager.setTempReading(fcelsius);
          fs.appendFile(redundantFile, JSON.stringify(fjsonObj)+'\n', (err) => {
            if (err) throw err;
            //console.log('Fake temperature reading backed up: ', fjsonObj);
          });
          console.log('FAKE: Temperature sensor recorded: ', fjsonObj);
      }

      else {
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
                if (split_str.length != 5) {
                  console.log("ERROR: Thermometer driver returned improperly formatted string: " + stdout);
                }

                var date       = split_str[0];
                var time       = split_str[1];
                var fahrenheit = split_str[3].slice(0, -1);
                var celsius    = split_str[4].slice(0, -1);
                var jsonObj = {'date': date, 'time': time, 'celsius': celsius};

                if (date.length != 10) {
                  console.log("ERROR: Thermometer date is incorrectly formatted: " + date);
                  return;
                }
                if (time.length !=  8) {
                  console.log("ERROR: Thermometer time is incorrectly formatted: " + time);
                  return;
                }
                if (celsius < -10 || celsius > 50) {
                  console.log("ERROR: Thermometer reading out of bounds: " + celsius);
                  return;
                }

                crudManager.storeData(jsonObj); // TODO: Add error handling on fail
                settingsManager.setTempReading(celsius);
                fs.appendFile(redundantFile, JSON.stringify(jsonObj)+'\n', (err) => {
                  if (err) throw err;
                  //console.log('Temperature reading backed up: ', jsonObj);
                });
                console.log('Temperature sensor recorded: ', jsonObj);
            }
            else {
                console.log("ERROR with the temperature sensor");
                console.log(error);
                return;
            }
        });
    }

    // Returns JSON object to store
    weightDriver(crudManager, settingsManager, redundantFile) {
      var constDepthDiv = 1.05;

      // Return fake readings
      if (this.weight_stub_driver_on) {
          var fdate   = '2014/10/30'
          var ftime   = '07:00:36'
          var fweight = '2.00'
          var depthInInches = (parseFloat(weight)/constDepthDiv).toFixed(2);

          var fjsonObj = {'date': date, 'time': time, 'weight': weight, 'estimatedDepth': depthInInches};

          crudManager.storeData(fjsonObj); // TODO: Add error handling on fail
          settingsManager.setWeightReading(fweight);
          
          fs.appendFile(redundantFile, JSON.stringify(fjsonObj)+'\n', (err) => {
            if (err) throw err;
            //console.log('Fake temperature reading backed up: ', fjsonObj);
          });
          console.log('FAKE: Weight sensor recorded: ', fjsonObj);
      }
      else {

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
                  if (split_str.length != 4) {
                    console.log("ERROR: Weight driver returned improperly formatted string: " + stdout);
                  }

                  var date   = split_str[0];
                  var time   = split_str[1];
                  var weight = split_str[2];
                  var fdepthInInches = (parseFloat(fweight)/constDepthDiv).toFixed(2);


                  if (date.length != 10) {
                    console.log("ERROR: Weight driver date is incorrectly formatted: " + date);
                    return;
                  }
                  if (time.length !=  8) {
                    console.log("ERROR: Weight driver time is incorrectly formatted: " + time);
                    return;
                  }
                  if (weight < 0 || weight > 100) {
                    console.log("ERROR: Weight driver reading is out of bounds: " + weight);
                    return;
                  }

                  var jsonObj = {'date': fdate, 'time': ftime, 'weight': fweight, 'estimatedDepth': fdepthInInches};
                  crudManager.storeData(jsonObj); // TODO: Add error handling on fail
                  settingsManager.setWeightReading(weight);
                  fs.appendFile(redundantFile, JSON.stringify(jsonObj)+'\n', (err) => {
                    if (err) throw err;
                    //console.log('Temperature reading backed up: ', jsonObj);
                  });
                  console.log('Weight sensor recorded: ', jsonObj);
              } else {
                  console.log("ERROR with the weight sensor");
                  console.log(error);
                  return;
              }
          });
    }


    // Generic looping function, used by each sensor
    loopReadDataFromFile(crudManager,settingsManager, driverFunction, timeDelay, redundantFile) {
      driverFunction(crudManager, settingsManager, redundantFile);
      setTimeout(this.loopReadDataFromFile.bind(this), timeDelay, crudManager, settingsManager, driverFunction, timeDelay, redundantFile);
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
      this._temperatureSettingsManager.load(messageCenter);
      this._pressureSettingsManager.load(messageCenter);
      this._weightSettingsManager.load(messageCenter);
      return Promise.resolve()
      .then(() => console.log('Loaded Weather Dashboard Module!'))
      
      // Temperature sensor loop
      .then(() => this.loopReadDataFromFile(
                         this._temperatureCrudManager,
                         this._temperatureSettingsManager,
                         this.temperatureDriver,
                         this.temperatureTimeDelay,
                         this.temperatureRedundantFile ))

      // Weight sensor loop
      .then(() => this.loopReadDataFromFile(
                         this._weightCrudManager,
                         this._weightSettingsManager,
                         this.weightDriver,
                         this.weightTimeDelay,
                         this.weightRedundantFile ));
    }

    unload() {
      return Promise.resolve()
      .then(() => console.log(this._temperatureCrudManager.unload(messageCenter)))
      .then(() => console.log(this._pressureCrudManager.unload(messageCenter)))
      .then(() => console.log(this._weightCrudManager.unload(messageCenter)))
      .then(() => console.log(this._temperatureSettingsManager.unload(messageCenter)))
      .then(() => console.log(this._pressureSettingsManager.unload(messageCenter)))
      .then(() => console.log(this._weightSettingsManager.unload(messageCenter)));
    }
  }

  module.exports = new App();
})();
