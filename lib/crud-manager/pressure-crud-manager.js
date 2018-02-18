(() => {
  'use strict';

  const MongodbCrudManager = global.helper.MongodbCrudManager;

  class PressureCrudManager extends MongodbCrudManager {

    constructor() {
      super('pressureData', {dbName: 'weatherData', tag: 'pTag', scopes:['public']});
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

  module.exports = PressureCrudManager;
})();
