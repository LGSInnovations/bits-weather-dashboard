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
  
  const Messenger = global.helper.Messenger;
  
  //example 
  function getBitsSystemId(messageCenter) {
    return messageCenter.sendRequest('base#System bitsId')
    .then((systemId) => {
      console.log(`BITS IDID is ${systemId}.`);
    })
    .catch((err) => {
      console.error('Failed to get the BITS system id:', err);
    });
  }

  var path       = require('path'),
      fs         = require('fs'),
      exec       = require('child_process').exec,
      filePath   = path.join(__dirname, 'data.csv'),
      scriptName = path.join(__dirname, 'example_executable.py'),
      assert     = require('assert');

   
  // Issues with this call to Mongo - Collection name must be a string
  // 
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
  }
  

  /// mongodb module connection & data retrieval/insertion testing ///
  const testData = [
  	{collectionName: 'user', dbName: 'user'}
  ];
  
  const data = [
     {'name': 'bob', 'age': '39'}
  ];
  
  //insertOne(CollectionConstants.REQUEST.INSERT_ONE, null, this._collectionName, doc, {dbName: this._dbName, options: options})
  function MongoInsert(metadata, data) {
    testData.push(data);
    Promise.resolve(testData);
  }
  
  function MongoFind(messageCenter) {
  	return messageCenter.sendRequest('mongodb#Collection find', null, 'user', {'name':'callie'}, {dbName: 'user'})
  	.then((response) => {
  	  console.log(`testing mongoFind response was ${response}`);
  	  console.log(`response length ${response.length}`);
  	})
    .catch((err) => {
      console.error('Failed finding doc in collection user error =:', err);
    });
  }
  
  function MongoCursor(messageCenter){
    return messageCenter.sendRequest('mongodb#Cursor toArray')
    .then((response) => {
      console.log(`testing cursor ${response}`);
    })
    .catch((err) => {
      console.error('failed error is :',err);
    });
  }
  
  function MongoTest(metadata) {
    return Promise.resolve(testData);
  }

  function onInitialized() {
    console.log('Base is initialized');
  }	
  
  /// mongo testing ///

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

  function interpretThermometerString(file) {
      // assumed str format: 'yyyy/mm/dd hh:mm:ss Temperature XX.XXF XX.XXC'
/*      var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream('/home/kelsey/projects/bits/data/base/modules/modules/bits-weather-dashboard/data.csv')
      });

      lineReader.on('line', function (line) {
          console.log('Line from file: ', line);*/
          var split_str = String(line).trim().split(" ");
          assert(split_str.length == 5, "Thermometer string is incorrectly formatted: " + line);

          var date    = split_str[0];
          var time    = split_str[1];
          var celsius = split_str[4].slice(0, -1);

          assert(date.length == 10, "Date is incorrectly formatted: " + date);
          assert(time.length ==  8, "Time is incorrectly formatted: " + time);

          console.log("date: "    + date);
          console.log("time: "    + time);
          console.log("celsius: " + celsius);
      };



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
      this._messenger = new global.helper.Messenger();
      //this._dbName = 'user';
      //this._collectionName = 'user';
      //this._messenger.addRequestListener('mongodb#Collection find', {scopes: ['public']}, getMongoFind);
      //this._messenger.addRequestListener('mongodb#Collection insertOne', {scopes: ['public']}, MongoInsert);
      this._messenger.addRequestListener('mongodb#Collection find', {scopes: ['public']}, MongoTest);
      this._messenger.addRequestListener('mongodb#Cursor toArray', {scopes: ['public']}, MongoCursor);
      //this._messenger.addRequestListener('mongodb#Collection insertOne', {scopes: ['public']}, callMongoAPI);
    }
  
    load(messageCenter) {
      return getBitsSystemId(messageCenter)
      .then(() => this._messenger.load(messageCenter))
      .then(() => messageCenter.sendEvent('weather-dashboard#App', {scopes: ['public']}, {type: 'loaded'}))
      .then(() => messageCenter.addEventListener('base#Base initialized', {scopes: null}, onInitialized))
      .then(() => console.log('Loaded Weather Dashboard Module!'))
      //.then(() => console.log(captureExecutableOutput(filePath)))

      //.then(() => console.log(readDataFromFile(filePath)));
      //callMongoAPI(messageCenter);
      .then(() => console.log(loopReadDataFromFile(filePath, 1)));
      //loopReadDataFromFile(filePath, 1);
      //return true;
    }

    unload() {
      return Promise.resolve()
      .then(() => messageCenter.removeEventListener('base#Base initialized', onInitialized))
      .then(() => this._messenger.unload());
    }
  }

  module.exports = new App();
})();
