(() => {
  'use strict';

  const TemperatureSettingsManager = require("./temperature-settings-manager");
  const KEY_TEMP_READING = 'reading';
  class TemperatureSManager extends TemperatureSettingsManager {

    constructor() {
      //super('currentTemperatureData', {dbName: 'weatherData', tag: 'current_tTag', scopes:['public']});
      super('current#TemperatureSettings',{scopes:'public'});
    }

    setTempReading(reading){
      //return super.set({key: KEY_TEMP_READING, value: reading});
      return super.setTempReading(reading);
    }

    load(messageCenter) {
      return super.load(messageCenter);
    }

    unload() {
      return super.unload();
    }
  }

  module.exports = TemperatureSManager;
})();