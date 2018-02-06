(() => {
  'use strict';
  
  const MongodbCrudManager = global.helper.MongodbCrudManager;
  
  function addTempReading() {
    console.log("something should go here");
  
  }
  
  class WeatherCrudManager extends MongodbCrudManager {
  
    constructor() {
      super('temperatureData', {dbName: 'weatherData', tag: 'wTag', scopes:['public']});
    }
    
    load(messageCenter,date,time,celsius) {
      console.log(date);
      console.log("asdfa");
      console.log(time);
      console.log(celsius);
      return super.load(messageCenter)
      .then(() => this.create({date: date, time: time, data: celsius})); //this.create({dateRan: Date.now()}));
    }
    
    /*addReading(date, time, celsius) {
      return this.create({date: date, time:time, data: celsius});
    }*/
    
    unload() {
      return super.unload();
    }
  }
  
  module.exports = WeatherCrudManager;
})();
