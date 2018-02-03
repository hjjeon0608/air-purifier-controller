const adjustDevice = require('./adjustDevice');
const logger = require('./logger');

function createAdjustModeToAirQuality({ settingsPerPollutionLevel, deviceNames }) {
  return function adjustModeToAirQuality(connections) {
    connections.forEach(async connection => {
      const device = connection.device;
      const pm2_5 = await device.pm2_5();
      const deviceName = deviceNames[connection.id] || connection.id;

      logger.log(`${deviceName}: current PM2,5 level is ${pm2_5}µg/m3`);
      
      const tresholds = Object.keys(settingsPerPollutionLevel).reverse();
      let settings;

      for (const treshold of tresholds) {
        if (pm2_5 > treshold) {
          settings = settingsPerPollutionLevel[treshold];
          break;
        }
      }

      if (!settings) {
        throw new Error('Settings per pollution level are invalid');
      }

      adjustDevice({ settings, device, deviceName });
    });
  }
}

module.exports = createAdjustModeToAirQuality;