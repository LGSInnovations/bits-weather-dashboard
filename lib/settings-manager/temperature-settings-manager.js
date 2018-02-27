
const SettingsManager = global.helper.SettingsManager;
const KEY_REQUEST_TIMEOUT = 'requestTimeout';
const DEFAULT_REQUEST_TIMEOUT = 2;
const DEFAULT_READING = 2;

class TemperatureSettingsManager {
  static get TAG() {
    return 'current#TemperatureSettings';
  }

  static get SCOPES() {
    return ['public'];
  }

  constructor() {
    this._settings = new SettingsManager(TemperatureSettingsManager.TAG, {scopes: TemperatureSettingsManager.SCOPES});
  }

  load(messageCenter) {
    return Promise.resolve()
    .then(() => this._settings.load(messageCenter))
    .then(() => this._settings.setDefault({key: KEY_TEMP_READING, value: DEFAULT_READING}))
    .then(() => this._settings.setDefault({key: KEY_REQUEST_TIMEOUT, value: DEFAULT_REQUEST_TIMEOUT}));
    
  }

  unload() {
    return Promise.resolve()
    .then(() => this._settings.unload());
  }

  getTimeoutDuration() {
    return this._settings.get({key: KEY_REQUEST_TIMEOUT, defValue: DEFAULT_REQUEST_TIMEOUT});
  }

  setTimeoutDuration(requestTimeout) {
    return this._settings.set({key: KEY_REQUEST_TIMEOUT, value: requestTimeout});
  }
  
  setTempReading(reading){
    return this._settings.set({key: KEY_TEMP_READING, value: reading});
  }
}