(() => {
  'use strict';

  const MongodbCrudManager = global.helper.MongodbCrudManager;

  class WeightCrudManager extends MongodbCrudManager {

    constructor() {
      super('weightData', {dbName: 'weatherData', tag: 'wTag', scopes:['public']});
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

  module.exports = WeightCrudManager;
})();
