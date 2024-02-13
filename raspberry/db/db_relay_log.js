const exucutor = require("./executor.js");

module.exports = {
    addLog: (deviceId, state, reason) => {
        return exucutor.query( "INSERT INTO relay_log (device_id, state, change_reason) " + 
            " VALUES(?, ?, ?) " ,
            [deviceId, state, reason]
        );
    },
    getLast: (deviceId) => {
        return exucutor.query( "SELECT * FROM relay_log \
             WHERE device_id = ? ORDER BY id DESC LIMIT 1 " ,
            [deviceId]
        );
    },
    getAll: (limit) => {
        return exucutor.query( "SELECT * FROM relay_log \
                ORDER BY id DESC LIMIT ? " ,
            [limit]
        );
    }
}