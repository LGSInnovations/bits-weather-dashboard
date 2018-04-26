(() => {
  'use strict';
  const SettingsManager = global.helper.SettingsManager;
  //const WeightSettingsManager = require('weight-settings-manager.js');
  //const DepthSettingsManager = require('depth-settings-manager.js');
  const KEY_QUALITY_READING = 'reading';
  const DEFAULT_READING = 2;

  class QualitySettingsManager {
    static get TAG() {
      return 'current#QualitySettings';
    }

    static get SCOPES() {
      return ['public'];
    }

    constructor() {
      this._settings = new SettingsManager(QualitySettingsManager.TAG, {scopes: QualitySettingsManager.SCOPES});
      //this._weightSettingsManager = new WeightSettingsManager();
      //this._depthSettingsManager = new DepthSettingsManager();
    }

    load(messageCenter) {
      return Promise.resolve()
      .then(() => this._settings.load(messageCenter))
      .then(() => this._settings.setDefault({key: KEY_QUALITY_READING, value: DEFAULT_READING}));
      
    }

    unload() {
      return Promise.resolve()
      .then(() => this._settings.unload());
    }

    getQualityReading(){
      return this._settings.get({key: KEY_QUALITY_READING, defValue: DEFAULT_READING});
    }
    
    setQualityReading(reading){
      //var weight = this._weightSettingsManager.getWeightReading()
      //var depth = this._depthSettingsManager.getDepthReading()
      //var quality = weight+depth
      return this._settings.set({key: KEY_QUALITY_READING, value: reading});
    }
  }
  module.exports = QualitySettingsManager;
})();