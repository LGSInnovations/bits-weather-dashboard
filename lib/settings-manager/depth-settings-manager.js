(() => {
  'use strict';
  const SettingsManager = global.helper.SettingsManager;
  const KEY_DEPTH_READING = 'reading';
  const DEFAULT_READING = 2;

  class DepthSettingsManager {
    static get TAG() {
      return 'current#DepthSettings';
    }

    static get SCOPES() {
      return ['public'];
    }

    constructor() {
      this._settings = new SettingsManager(DepthSettingsManager.TAG, {scopes: DepthSettingsManager.SCOPES});
    }

    load(messageCenter) {
      return Promise.resolve()
      .then(() => this._settings.load(messageCenter))
      .then(() => this._settings.setDefault({key: KEY_DEPTH_READING, value: DEFAULT_READING}));
      
    }

    unload() {
      return Promise.resolve()
      .then(() => this._settings.unload());
    }

    getDepthReading(){
      return this._settings.get({key: KEY_DEPTH_READING, defValue: DEFAULT_READING});
    }
    
    setDepthReading(reading){
      return this._settings.set({key: KEY_DEPTH_READING, value: reading});
    }
  }
  module.exports = DepthSettingsManager;
})();