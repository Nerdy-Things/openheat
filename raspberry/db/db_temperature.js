const exucutor = require("./executor.js");

module.exports = {
    getTemperature: (startDate, endDate, limit) => {
      return exucutor.query( 
        "SELECT * FROM temperature WHERE actual_time BETWEEN ? AND ? ORDER BY ID DESC LIMIT ? ",
        [startDate, endDate, limit]
      );
    },
    addTemperature: (temperature, device_id, actualTime, correctedTime) => {
      return exucutor.query( "INSERT INTO temperature \
      (temperature, device_id, actual_time, rounded_time) \
      VALUES(?, ?, ?, ?)",
        [temperature, device_id, actualTime, correctedTime]
      );
    },
    updateTemperature: (temperature, rowId, actualTime) => {
      return exucutor.query( "UPDATE temperature \
        SET temperature = ?, actual_time = ? \
        WHERE id = ?",
        [temperature, actualTime, rowId]
      );
    },
    getLastKnownTemperature: (device_id, limit) => {
      return exucutor.query( "SELECT * FROM temperature \
        WHERE device_id = ? ORDER BY actual_time DESC LIMIT ?",
        [device_id, limit]
      );
    },
    getSensorDataForLastNMinutes: (deviceId, minutes, limit) => {
      return exucutor.query( "SELECT * FROM temperature \
          WHERE device_id = ? and  \
          actual_time >= NOW() - INTERVAL ? MINUTE \
          order by id DESC LIMIT ? ",
          [deviceId, minutes, limit]
      )
    }
}