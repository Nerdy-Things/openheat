const exucutor = require("./executor.js");

module.exports = {
    getActionsForDevice: (deviceId) => {
        return exucutor.query( "SELECT * FROM action " + 
            " WHERE device_id = ? ORDER BY type, sensor_id, time_from" 
            ,
            [deviceId]
        );
    },
    addAction: (deviceId, type, from, to, state, sensorId, sensorMin, sensorMax) => {
        if (! from) from = null;
        if (! to) to = null;
        if (! sensorId) sensorId = null;
        return exucutor.query( "INSERT INTO action " + 
            " (device_id, sensor_id, type, time_from, time_to, target_state, sensor_min_value, sensor_max_value) " + 
            " VALUES(?, ?, ?, ?, ?, ?, ?, ?) " 
            ,
            [deviceId, sensorId, type, from, to, state, sensorMin, sensorMax]
        );
    },
    addActionEnabled: (deviceId, type, minutes) => {
        return exucutor.query(  "INSERT INTO action (device_id, type, enabled_until, target_state) " +
            " values(?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE), 1) ",
            [deviceId, type, parseInt(minutes)]
        )
    },
    deleteAction: (deviceId, actionId) => {
        return exucutor.query( "DELETE FROM action " + 
        " WHERE id = ? and device_id = ? "
        ,
        [actionId, deviceId]
    );
    },
    getActiveSwitcher: (deviceId) => {
        return  exucutor.query( "SELECT * FROM action " + 
                " WHERE device_id = ? and enabled_until >= NOW() AND `type` = 'switcher'" ,
                [deviceId]
        );
    },
    deleteSwitchers: (deviceId) => {
        return  exucutor.query( "DELETE FROM action " + 
                " WHERE device_id = ? AND `type` = 'switcher'" ,
                [deviceId]
        );
    },
    getActiveSchedule: async(deviceId, timezone) => {
        return exucutor.query( "SELECT  \
            `action`.* \
            FROM `action` \
            WHERE TIME(NOW()) \
            BETWEEN TIME(time_from) AND TIME(time_to) AND device_id = ? AND `type` = 'schedule'",
            [ deviceId]
            ); 
    },
    getActiveSensor: async(deviceId, timezone) => {
        return exucutor.query( "SELECT  \
            `action`.* \
            FROM `action` \
            WHERE TIME(NOW()) \
            BETWEEN TIME(time_from) AND TIME(time_to) AND device_id = ?  AND `type` = 'sensor'",
            [deviceId]
            ); 
    },
    
}