(() => {
  'use strict';
  const SettingsManager = global.helper.SettingsManager;
  const KEY_PRESS_READING = 'reading';
  const DEFAULT_READING = 2;

  class PressureSettingsManager {
    static get TAG() {
      return 'current#PressureSettings';
    }

    static get SCOPES() {
      return ['public'];
    }

    constructor() {
      this._settings = new SettingsManager(PressureSettingsManager.TAG, {scopes: PressureSettingsManager.SCOPES});
    }

    load(messageCenter) {
      return Promise.resolve()
      .then(() => this._settings.load(messageCenter))
      .then(() => this._settings.setDefault({key: KEY_PRESS_READING, value: DEFAULT_READING}));
      
    }

    unload() {
      return Promise.resolve()
      .then(() => this._settings.unload());
    }

    getPressureReading(){
      return this._settings.get({key: KEY_PRESS_READING, defValue: DEFAULT_READING});
    }
    
    setPressureReading(reading){
      return this._settings.set({key: KEY_PRESS_READING, value: reading});
    }
  }
  module.exports = PressureSettingsManager;
})();