(() => {
  'use strict';
  const SettingsManager = global.helper.SettingsManager;
  const KEY_REQUEST_TIMEOUT = 'requestTimeout';
  const KEY_WEIGHT_READING = 'reading';
  const DEFAULT_REQUEST_TIMEOUT = 2;
  const DEFAULT_READING = 2;

  class WeightSettingsManager {
    static get TAG() {
      return 'current#WeightSettings';
    }

    static get SCOPES() {
      return ['public'];
    }

    constructor() {
      this._settings = new SettingsManager(WeightSettingsManager.TAG, {scopes: WeightSettingsManager.SCOPES});
    }

    load(messageCenter) {
      return Promise.resolve()
      .then(() => this._settings.load(messageCenter))
      .then(() => this._settings.setDefault({key: KEY_WEIGHT_READING, value: DEFAULT_READING}));
      
    }

    unload() {
      return Promise.resolve()
      .then(() => this._settings.unload());
    }

    getWeightReading(){
      return this._settings.get({key: KEY_WEIGHT_READING, defValue: DEFAULT_READING});
    }
    
    setWeightReading(reading){
      return this._settings.set({key: KEY_WEIGHT_READING, value: reading});
    }
  }
  module.exports = WeightSettingsManager;
})();