const DeviceConnectionManager = require('./DeviceConnectionManager');
const createAdjustModeToAirQuality = require('./createAdjustModeToAirQuality');

function run(logger = console) {
  logger.log('Welcome to Air Purifier Controller daemon!');

  const manager = new DeviceConnectionManager();
  manager.discoverDevices();

  const adjustModeToAirQuality = createAdjustModeToAirQuality();

  setTimeout(() => {
    adjustModeToAirQuality(manager.getConnectedAirPurifiers());

    setInterval(() => {
      adjustModeToAirQuality(manager.getConnectedAirPurifiers());
    }, 30000);
  }, 3000);
}

module.exports = run;