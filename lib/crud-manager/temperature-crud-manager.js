(() => {
  'use strict';

  const MongodbCrudManager = global.helper.MongodbCrudManager;

  class TemperatureCrudManager extends MongodbCrudManager {

    constructor() {
      super('temperatureData', {dbName: 'weatherData', tag: 'wTag', scopes:['public']});
    }

    storeData(jsonObj) {
      this.create(jsonObj);
    }

    load(messageCenter) {
      return super.load(messageCenter);
    }

    unload() {
      return super.unload();
    }
  }

  module.exports = TemperatureCrudManager;
})();
