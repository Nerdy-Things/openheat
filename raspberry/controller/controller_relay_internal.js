const gpiox = require("@iiot2k/gpiox");

const pin = 23
gpiox.load_driver();
gpiox.init_pin(pin, gpiox.GPIO_MODE_OUTPUT, 0);
gpiox.set_pin(pin, false);
let currentState = 0;

const updateInterval = 3000
let interval;

module.exports = {
    startPeriodingChecking: () => {
        interval = setInterval(async () => {
            module.exports.checkState();
        }, updateInterval);
        module.exports.checkState();
    },

    stopPeriodicChecking: () => {
        if (interval) clearInterval(interval);
    },

    checkState: async () => {
        const deviceId = (await core.db.system.getConfig()).device_uuid;
        await core.db.device.addDevice(deviceId, "relay")
        await core.db.device.setStatus(deviceId, "online")
    
        const devices = await core.db.device.getById(deviceId);
        if (devices.length == 0) {
            gpiox.set_pin(pin, 0);
            await core.db.device.setState(deviceId, "off");
            await core.db.device.setStatus(deviceId, "offline")
            currentState = 0;
            return
        }

        const device = devices[0];

        const targetState = await core.controller.relay.internal.getCurrentState(deviceId);
    
        if (device['state'] == "blocked") {
            gpiox.set_pin(pin, 0);
            await core.db.device.setState(deviceId, "blocked");
            currentState = 0;
            return
        }

        if (currentState == targetState.state) {
            return
        }

        console.log("SETTING OFF", device["state"], device);
        await core.db.relayLog.addLog(deviceId, (targetState.state) ? "on" : "off", targetState.reason);
        await core.db.device.setState(deviceId, (targetState.state) ? "on" : "off");
        currentState = targetState.state;
        gpiox.set_pin(pin, targetState.state);
    },

    getCurrentState: async (deviceId) => {
        let deviceInfo = (await core.db.device.getById(deviceId));
        if (deviceInfo.length == 0) {
            console.log("Device not found", deviceId);
            return {state: 0, reason: "Device not found"};
        }

        deviceInfo = deviceInfo[0];

        if (deviceInfo['state'] == 'blocked')  {
            console.log("Device is blocked", deviceId);
            return {state: 0, reason: "Device is blocked"};
        }

        const switcherAction = await core.db.action.getActiveSwitcher(deviceId);
        if (switcherAction.length > 0) {
            const state = switcherAction[0]['target_state']
            console.log("SWITCHER ENABLE", deviceId, "state", state);
            return {state: parseInt(state), reason: "Switcher state"};
        } else {
            await core.db.action.deleteSwitchers(deviceId);
        }

        
        const scheduledAction = await core.db.action.getActiveSchedule(deviceId);
        if (scheduledAction.length > 0) {
            for (schedule of scheduledAction) {
                const state = parseInt(schedule['target_state'])
                console.log("SCHEDULE ENABLE", deviceId, "state", state,  "schedulers count", scheduledAction.length);
                return {state: parseInt(state), reason: "Scheduled state"};
            }
        }

        const sensorAction = await core.db.action.getActiveSensor(deviceId);
        if (sensorAction.length > 0) {
            console.log("Sensor linked. Looking for data.", deviceId, "state", 1,  "sensors count", sensorAction.length);
            for (sensor of sensorAction) {
                const sensorId = sensor['sensor_id']
                const sensorsData = await core.db.temperature.getSensorDataForLastNMinutes(sensorId, 6, 1)
                if (sensorsData.length > 0) {
                    for (sensorData of sensorsData) {
                        if (sensorData['temperature'] >= sensor['sensor_max_value']) {
                            console.log("OVERHEAT DISABLE", deviceId, "temperature", sensorData['temperature']);
                            return {state: 0, reason: "Overheated sensor", sensor: sensor};
                        }
                    }
                    for (sensorData of sensorsData) {
                        console.log("Device sensor temperature.", deviceId, "temperature", sensorData['temperature']);
                        if (sensorData['temperature'] < sensor['sensor_min_value']) {
                            console.log("TEMPERATURE ENABLE", deviceId, "temperature", sensorData['temperature'], "target", sensor['sensor_min_value']);
                            return {state: 1, reason: "Underheated sensor", sensor: sensor};
                        }
                    }
                } else {
                    console.log("Sensor data is missing.", deviceId, "sensorId", sensorId);
                }
            }
        }
        return {state: 0, reason: "No conditions"};
    }
}