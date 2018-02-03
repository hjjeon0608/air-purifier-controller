module.exports = {
  // Allows to define different air purifier settings depending on the PM2.5 pollution.
  //
  // Each setting will apply for PM 2.5 range between the setting key and the next setting key.
  // Should define the following properties:
  // on - whether the device should operate
  // mode - what mode should the device operate in (obligatory when on is true)
  // favoriteLevel - what is the level for favorite (user controlled) mode - between 1 and 16
  settingsPerPollutionLevel: {
    0: { // below 8
      on: false
    },
    8: { // below 20
      on: true,
      mode: 'auto',
    },
    20: { // below 30
      on: true,
      mode: 'favorite',
      favoriteLevel: 6,
    },
    25: { // below 50
      on: true,
      mode: 'favorite',
      favoriteLevel: 8
    },
    30: { // below 50
      on: true,
      mode: 'favorite',
      favoriteLevel: 10
    },
    40: { // below 50
      on: true,
      mode: 'favorite',
      favoriteLevel: 13
    },
    50: { // equal or above 50
      on: true,
      mode: 'favorite',
      favoriteLevel: 16
    }
  },
  // Defines device names in the following format:
  // { [connectionId]: [deviceName], ... }
  deviceNames: {
    54716020: 'Living room',
    54455525: 'Kitchen',
    54379102: 'Bedroom'
  },
  connectionCacheTime: 300,
  pollutionCheckFrequency: 30,
  initialCheckDelay: 3,
};
