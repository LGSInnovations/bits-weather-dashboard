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

  var path = require('path'),
    fs = require('fs'),
    exec = require('child_process').exec,
    filePath = path.join(__dirname, 'data.csv'),
    scriptName = path.join(__dirname, 'example_executable.py');

  

  function captureExecutableOutput(filePath) {
    return exec("python " + scriptName, 
      function(error, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });
  }

  function readDataFromFile(filePath) {
    return fs.readFile(filePath, function(err, data){
      if(err) {
        console.log(err)
      }
      else {
        console.log("File successfully read!")
        var split_data = data.toString().split(" ");
        // Data format: 'yyyy/mm/dd hh:mm:ss Temperature XX.XXF XX.XXC'

        var date    = split_data[0];
        var time    = split_data[1];
        var celsius = split_data[2].slice(0, -1);

        console.log("date: "    + date);
        console.log("time: "    + time);
        console.log("celsius: " + celsius);
      }
    });
  }

  function loopReadDataFromFile(filePath, delayInSeconds) {
    console.log(filePath);
    console.log(delayInSeconds);
    readDataFromFile(filePath);
    setTimeout(loopReadDataFromFile, 5000, filePath, delayInSeconds);
    return true;
  }


  class App {
    load(messageCenter) {
      console.log('Loaded Weather Dashboard Module!');
      console.log(captureExecutableOutput(filePath));
      console.log(readDataFromFile(filePath));
      loopReadDataFromFile(filePath, 1);
      return true;
    }

    unload() {
      return Promise.resolve();
    }
  }

  module.exports = new App();
})();
