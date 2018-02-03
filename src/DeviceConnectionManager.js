const process = require('process');
const miio = require('miio');

const logger = require('./logger');

class DeviceConnectionManager {
  constructor({ cacheTime, deviceNames }) {
    this._connections = {};
    this._cacheTime = cacheTime;
    this._deviceNames = deviceNames;
  }

  discoverDevices() {
    logger.log('Discovering Xiaomi devices connected to the local network...');

    const connections = miio.devices({ cacheTime: this._cacheTime });

    connections.on('available', connection => this._handleDeviceConnected(connection));
    connections.on('unavailable', connection => this._handleDeviceDisconnected(connection));
    connections.on('error', console.error);
    process.on('SIGINT', () => this._tearDown());
  }

  getConnectedAirPurifiers() {
    return Object.values(this._connections)
      .filter(connection => connection.device.matches('type:air-purifier'))
  }

  _handleDeviceConnected(connection) {
    try {
      const deviceName = this._deviceNames[connection.id] || 'unknown';
      logger.log(`Device ${deviceName} connected`);
      this._connections[connection.id] = connection;
    } catch (e) {
      logger.error(e);
    }
  }

  async _handleDeviceDisconnected(connection) {
    try {
      const deviceName = this._deviceNames[connection.id] || connection.id;
      logger.log(`Device ${deviceName} has disconnected`);

      const connection = this._connections[id];
      if (!connection) return;

      await connection.destroy();
      delete this._connections[id];
    } catch (e) {
      logger.error(e);
    }
  }

  async _tearDown() {
    const activeConnections = Object.entries(this._connections);
    if (activeConnections.length) {
      logger.log('\nClosing device connections');
      activeConnections.forEach(async connection => await connection.destroy());
    }
    logger.log('Qutting');
    process.exit(0);
  }
}

module.exports = DeviceConnectionManager;
