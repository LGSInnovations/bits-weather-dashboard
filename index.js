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

  const WeatherCrudManager = require('./lib/crud-manager/crud-manager.js');

  var path       = require('path'),
      fs         = require('fs'),
      exec       = require('child_process').exec,
      filePath   = path.join(__dirname, 'data.csv'),
      scriptName = path.join(__dirname, 'example_executable.py'),
      assert     = require('assert');


  class App {

    constructor() {
      this._crudManager = new WeatherCrudManager();
      this.filePath = path.join(__dirname, 'data.csv');
      this.temperatureTimeDelay = 5000;
      this.pressureTimeDelay = 1000;
      this.weightTimeDelay = 50000;
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

    loopReadDataFromFile() {
      var dt = new Date();  // Improve this section, creating new object on every entry
      var utcDate = dt.toUTCString();
      console.log('Current time: ', utcDate);

      this._crudManager.storeTemperatureData(utcDate, '37F', '1C'); // Replace temporary data with real data

      setTimeout(this.loopReadDataFromFile.bind(this), this.temperatureTimeDelay);
    }

    captureExecutableOutput(filePath) {
      return exec("python " + scriptName,
        function(error, stdout, stderr) {
          console.log(stdout);
          console.log(stderr);
      });
    }

    readDataFromFile(callback) {
      var content;
      fs.readFile(self.filePath, function read(err, data) {
        if (err) {
          throw err;
        }
        content = data;
        callback(data);
      });
    }

    interpretThermometerString(str) {
        // assumed str format: 'yyyy/mm/dd hh:mm:ss Temperature XX.XXF XX.XXC'
        var split_str = String(str).trim().split(" ");
        assert(split_str.length == 5, "Thermometer string is incorrectly formatted: " + str);

        var date        = split_str[0];
        var time        = split_str[1];
        var fahrenheit  = split_str[3].slice(0, -1);
        var celsius     = split_str[4].slice(0, -1);

        assert(date.length == 10, "Date is incorrectly formatted: " + date);
        assert(time.length ==  8, "Time is incorrectly formatted: " + time);

        console.log("date: "    + date);
        console.log("time: "    + time);
        console.log("celsius: " + celsius);
        return [fahrenheit, celsius];
    }

    load(messageCenter) {
      this._crudManager.load(messageCenter);
      return Promise.resolve()
      .then(() => console.log('Loaded Weather Dashboard Module!'))
      .then(() => this.loopReadDataFromFile());
    }

    unload() {
      return Promise.resolve()
      .then(() => console.log(this._crudManager.unload(messageCenter)));
    }
  }

  module.exports = new App();
})();
