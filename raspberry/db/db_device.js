const exucutor = require("./executor.js");

module.exports = {
    getById: (deviceId) => {
      return exucutor.query( "SELECT * FROM device " + 
          " where id = ? " ,
          [deviceId]
      );
    },
    addDevice: (deviceId, deviceType) => {
        let status = ""
        return exucutor.query( "INSERT INTO device (id, type) " + 
            " VALUES(?, ?) " + 
            " ON DUPLICATE KEY UPDATE last_seen = now() "
            ,
            [deviceId, deviceType]
        );
    },
    setDeviceName: (deviceId, name) => {
        return exucutor.query( "UPDATE device SET name = ? WHERE id = ? " ,
            [name, deviceId]
        );
    },
    setStatus: (deviceId, isOnline) => {
        let status = ""
        if (isOnline) {
            status = "online"
        } else {
            status = "offline"
        }
      return exucutor.query( "UPDATE device " +
        " SET status = ? " +
        " WHERE id = ? LIMIT 1",
        [status, deviceId]
      );
    },
    setState: async (deviceId, state) => {
      return exucutor.query( "UPDATE device " +
        " SET state = ? " +
        " WHERE id = ? LIMIT 1",
        [state, deviceId]
      );
    },
    getAll: () => {
        return exucutor.query( "SELECT * FROM device " +
        " LIMIT 100",
        []
      );
    },

    getByType: (type) => {
      return exucutor.query( "SELECT * FROM device where type = ?" +
        " LIMIT 100",
        [type]
      );
    },
    deactivateAll: () => {
        return exucutor.query( "UPDATE device set STATUS = 'offline', STATE = 'off'",
        []
      );
    },
    setHouseholdToAll: () => {
      return exucutor.query( "UPDATE device " + 
          " SET household_id = 1 " ,
          []
      );
    },
}