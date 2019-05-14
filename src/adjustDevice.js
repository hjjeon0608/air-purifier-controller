const logger = require('./logger');

const ALLOWED_MODES = ['auto', 'night', 'favorite'];

async function adjustDevice({ settings, device, deviceName }) {
  const isOn = await device.power();
  const currentMode = await device.mode();

  if (typeof settings.on !== 'boolean') {
    throw new Error('Incorrect "on" property - expected a boolean, got ' + typeof settings.on);
  }
  
  if ( isOn !== false) {
  //if (settings.on !== isOn) {
    //device.setPower(settings.on);
  //}
    if (settings.on === false) {
      // Do not do anything else if device should be turned off
      return; 
    }

    if (!ALLOWED_MODES.includes(settings.mode)) {
      throw new Error('Incorrect mode specified. It must be one of: ' + ALLOWED_MODES.join(', '));
    }

    if (settings.mode !== currentMode) {
      device.setMode(settings.mode);
      logger.log(`${deviceName}: Setting the mode to ${settings.mode}`);
    }

    if (settings.mode === 'favorite') {
      if (!Number.isInteger(settings.favoriteLevel) || settings.favoriteLevel < 1 || settings.favoriteLevel > 16) {
        throw new Error('Incorrect favorite level provided. It must be a number between 1 and 16');
      }

      const currentFavoriteLevel = await device.favoriteLevel();
      if (currentFavoriteLevel !== settings.favoriteLevel) {
        device.setFavoriteLevel(settings.favoriteLevel);
        logger.log(`${deviceName}: Setting the favorite level to ${settings.favoriteLevel}`);
      }
    }
  }//if ( isOn !== false) {

}

module.exports = adjustDevice;
