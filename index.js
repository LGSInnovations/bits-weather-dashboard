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
  
  const CrudManager = require('./lib/crud-manager/crud-manager.js');
  
  var path       = require('path'),
      fs         = require('fs'),
      exec       = require('child_process').exec,
      filePath   = path.join(__dirname, 'data.csv'),
      scriptName = path.join(__dirname, 'example_executable.py'),
      assert     = require('assert');
      
  var date = "date";
  var time = "time";
  var celsius = "celsius";

   
  // Issues with this call to Mongo - Collection name must be a string
  /*
  function callMongoAPI(messageCenter) {
    setTimeout(callMongoAPI, 5000, messageCenter);
    const data = {
      'name': 'bob',
      'password': 'other_data'
    };
    return messageCenter.sendRequest('mongodb#Collection insertOne', null, data)
    .then(() => {
      console.log('Mongo was called!')
    });
  }*/
  

  function captureExecutableOutput(filePath) {
    return exec("python " + scriptName, 
      function(error, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });
  }

  function readDataFromFile(filePath, callback) {
    var content;
    fs.readFile(filePath, function read(err, data) {
      if (err) {
        throw err;
      }
      content = data;
      callback(data);
    });
  }

  function interpretThermometerString(str) {
      // assumed str format: 'yyyy/mm/dd hh:mm:ss Temperature XX.XXF XX.XXC'
      var split_str = String(str).trim().split(" ");
      assert(split_str.length == 5, "Thermometer string is incorrectly formatted: " + str);

      var date    = split_str[0];
      var time    = split_str[1];
      var celsius = split_str[4].slice(0, -1);

      assert(date.length == 10, "Date is incorrectly formatted: " + date);
      assert(time.length ==  8, "Time is incorrectly formatted: " + time);

      console.log("date: "    + date);
      console.log("time: "    + time);
      console.log("celsius: " + celsius);

      //return [date, time, celsius];
  }

  function loopReadDataFromFile(filePath, delayInSeconds) {
    console.log("filepath: " + filePath);
    console.log("delay: "    + delayInSeconds);
    var data = readDataFromFile(filePath, interpretThermometerString);
    //var thermometer_values = interpretThermometerString(data);

    setTimeout(loopReadDataFromFile, 5000, filePath, delayInSeconds);
    return true;
  }


  class App {
  
    constructor() {
      this._crudManager = new CrudManager();
    }
  
    load(messageCenter) {
      return Promise.resolve()
      .then(() => console.log('Loaded Weather Dashboard Module!'))
      //.then(() => console.log(captureExecutableOutput(filePath)))
      .then(() => console.log(loopReadDataFromFile(filePath, 1)))
      .then(() => this._crudManager.load(messageCenter,date,time,celsius));
      //loopReadDataFromFile(filePath, 1);
      //return true;
    }

    unload() {
      return Promise.resolve()
      .then(() => this._crudManager.unload(messageCenter));
    }
  }

  module.exports = new App();
})();
