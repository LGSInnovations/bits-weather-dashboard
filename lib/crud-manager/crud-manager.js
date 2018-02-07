(() => {
  'use strict';

  const MongodbCrudManager = global.helper.MongodbCrudManager;

  class WeatherCrudManager extends MongodbCrudManager {

    constructor() {
      super('temperatureData', {dbName: 'weatherData', tag: 'wTag', scopes:['public']});
    }

    storeTemperatureData(ts, fahrenheit, celsius) {
      this.create({'timestamp': ts, 'fahrenheit': fahrenheit, 'celsius': celsius});
    }

    load(messageCenter) { //,date,time,celsius) {
      return super.load(messageCenter);
    }

    unload() {
      return super.unload();
    }
  }

  module.exports = WeatherCrudManager;
})();
