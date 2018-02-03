const config = require('./config');
const DeviceConnectionManager = require('./DeviceConnectionManager');
const createAdjustModeToAirQuality = require('./createAdjustModeToAirQuality');
const logger = require('./logger');

function run() {
  logger.log('Welcome to Air Purifier Controller daemon!');

  const manager = new DeviceConnectionManager({ cacheTime: config.connectionCacheTime, deviceNames: config.deviceNames });
  manager.discoverDevices();

  const adjustModeToAirQuality = createAdjustModeToAirQuality({
    settingsPerPollutionLevel: config.settingsPerPollutionLevel,
    deviceNames: config.deviceNames,
    logger
  });

  setTimeout(() => {
    adjustModeToAirQuality(manager.getConnectedAirPurifiers());

    setInterval(() => {
      adjustModeToAirQuality(manager.getConnectedAirPurifiers());
    }, config.pollutionCheckFrequency * 1000);
  }, config.initialCheckDelay * 1000);
}

module.exports = run;