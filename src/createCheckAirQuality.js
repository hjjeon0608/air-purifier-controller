const DEFAULT_GOOD_AIR_QUALITY = 20;
const DEFAULT_TERRIBLE_AIR_QUALITY = 50;

module.exports = function createCheckAirQuality(manager, logger = console, config = {}) {
  const goodAirQuality = config.goodAirQuality || DEFAULT_GOOD_AIR_QUALITY;
  const terribleAirQuality = config.terribleAirQuality || DEFAULT_TERRIBLE_AIR_QUALITY;

  return function checkAirQuality(airPurifiers) {
    manager.getConnectedAirPurifiers().forEach(async device => {
      try {
        logger.log(`${device.miioModel}: checking current air quality`);

        const pm2_5 = await device.pm2_5();
        const currentMode = await device.mode();

        logger.log(`${device.miioModel}: PM2,5 is ${pm2_5}µg/m3`);

        if (pm2_5 <= goodAirQuality) {
          if (currentMode !== 'auto') {
            device.setMode('auto');
            logger.log(`${device.miioModel}: good air quality, changing mode to slow`);
          } else {
            logger.log(`${device.miioModel}: good air quality`);
          }
          return;
        }

        const currentFavoriteLevel = await device.favoriteLevel();
        
        if (pm2_5 > goodAirQuality && pm2_5 <= terribleAirQuality) {
          if (currentMode !== 'favorite' || currentFavoriteLevel != 7) {
            device.setMode('favorite');
            device.setFavoriteLevel(7);
            logger.log(`${device.miioModel}: poor air quality, changing mode to half-speed`);
          } else {
            logger.log(`${device.miioModel}: poor air quality`);
          }
        } else {
          if (currentMode !== 'favorite' || currentFavoriteLevel != 16) {
            device.setMode('favorite');
            device.setFavoriteLevel(16);
            logger.log(`${device.miioModel}: terrible air quality, changing mode to turbo`);
          } else {
            logger.log(`${device.miioModel}: terrible air quality`);
          }
        }
      } catch (e) {
        logger.error(e);
      }
    });
  }
}