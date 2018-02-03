const process = require('process');
const miio = require('miio');

const DEFAULT_CACHE_TIME_IN_SECONDS = 300;

class DeviceConnectionManager {
  constructor({ cacheTime = DEFAULT_CACHE_TIME_IN_SECONDS } = {}, logger = console) {
    this._connections = {};
    this._cacheTime = cacheTime;
    this._logger = logger;
  }

  discoverDevices() {
    this._logger.log('Discovering Xiaomi devices connected to the local network...');

    const connections = miio.devices({ cacheTime: this._cacheTime });

    connections.on('available', connection => this._handleDeviceConnected(connection));
    connections.on('unavailable', connection => this._handleDeviceDisconnected(connection));
    connections.on('error', console.error);
    process.on('SIGINT', () => this._tearDown());
  }

  getConnectedAirPurifiers() {
    return Object.values(this._connections)
      .filter(connection => connection.device.matches('type:air-purifier'))
      .map(connection => connection.device);
  }

  _handleDeviceConnected(connection) {
    this._logger.log(`New device ${connection.device.miioModel} (${connection.id}) connected`);
    this._connections[connection.id] = connection;
  }

  async _handleDeviceDisconnected(connection) {
    this._logger.log(`Device ${connection.id} has disconnected`);

    const connection = this._connections[id];
    if (!connection) return;

    await connection.destroy();
    delete this._connections[id];
  }

  async _tearDown() {
    const activeConnections = Object.entries(this._connections);
    if (activeConnections.length) {
      this._logger.log('\nClosing device connections');
      activeConnections.forEach(async connection => await connection.destroy());
    }
    this._logger.log('Qutting');
    process.exit(0);
  }
}

module.exports = DeviceConnectionManager;
