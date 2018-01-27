const DeviceConnectionManager = require('./src/DeviceConnectionManager');
const createCheckAirQuality = require('./src/createCheckAirQuality');

function run() {
  const manager = new DeviceConnectionManager();
  manager.discoverDevices();

  const checkAirQuality = createCheckAirQuality(manager);

  setTimeout(() => {
    checkAirQuality();

    setInterval(() => {
      checkAirQuality();
    }, 30000);
  }, 3000);
}

run();
