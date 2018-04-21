(() => {
  'use strict';

  const MongodbCrudManager = global.helper.MongodbCrudManager;

  class DepthCrudManager extends MongodbCrudManager {

    constructor() {
      super('depthData', {dbName: 'weatherData', tag: 'dTag', scopes:['public']});
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

  module.exports = DepthCrudManager;
})();
