(() => {
  'use strict';
  
  const MongodbCrudManager = global.helper.MongodbCrudManager;
  
  class WeatherCrudManager extends MongodbCrudManager {
  
    constructor() {
      super('temperatureData', {dbName: 'weatherData', tag: 'wTag', scopes:['public']});
    }
    
    load(messageCenter,date,time,celsius) {
      return super.load(messageCenter)
      .then(() => this.create({date: date, time: time, data: celsius})); //{date: date, time: time, data: celsius}));
    }
    
    unload() {
      return super.unload();
    }
  }
  
  module.exports = WeatherCrudManager;
})();
