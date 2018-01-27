const process = require('process');
const miio = require('miio');

const DEFAULT_CACHE_TIME_IN_SECONDS = 300;

class DeviceConnectionManager {
  constructor({ cacheTime = DEFAULT_CACHE_TIME_IN_SECONDS } = {}, logger = console) {
    this._connections = {};
    this._cacheTime = cacheTime;
    this._logger = logger;
  }

  getConnectedDevices() {
    return this._connections;
  }

  getConnectedAirPurifiers() {
    return this.filterConnectedDevices('type:air-purifier');
  }

  filterConnectedDevices(filter) {
    return Object.values(this._connections)
      .filter(connection => connection.device.matches(filter))
      .map(connection => connection.device);
  }

  discoverDevices() {
    const devices = miio.devices({ cacheTime: this._cacheTime });

    devices.on('available', device => this._handleDeviceAvailable(device));
    devices.on('unavailable', device => this._handleDeviceUnavailable(device));
    devices.on('error', console.error);
    process.on('SIGINT', () => this._tearDown());
  }

  _handleDeviceAvailable(connection) {
    this._logger.log(`New device ${connection.device.miioModel} (${connection.id}) found`);
    this._connections[connection.id] = connection;
  }

  async _handleDeviceUnavailable(connection) {
    this._logger.log(`Device ${connection.id} has disconnected`);

    const connection = this._connections[id];
    if (!connection) return;

    await connection.destroy();
    delete this._connections[id];
  }

  async _tearDown() {
    this._logger.log('\nClosing device connections');
    Object.entries(this._connections)
      .forEach(async connection => await connection.destroy());
    this._logger.log('Qutting');
    process.exit(0);
  }
}

module.exports = DeviceConnectionManager;
