const moment = require("moment");

module.exports = {
    saveTemperature:async (req, res) => { 
        const deviceId = req.body.mac_address;
        const temperature = parseFloat(req.body.temperature);
        if (deviceId) {
            await core.db.device.addDevice(deviceId, 'thermo');
            const lastKnownTemperature = await core.db.temperature.getLastKnownTemperature(deviceId, 1);
            const futureRoundDateTime = core.util.datetime.formatToSQL(core.util.datetime.roundNowToNext5Minutes());
            const currentTime = core.util.datetime.formatToSQL(moment());
            if (lastKnownTemperature.length > 0 && 
                moment(lastKnownTemperature[0].rounded_time).isSame(moment(futureRoundDateTime))
            ) {
                await core.db.temperature.updateTemperature(temperature, lastKnownTemperature[0].id, currentTime);
            } else {
                await core.db.temperature.addTemperature(temperature, deviceId, currentTime, futureRoundDateTime);
            }
        }
        res.status(200).send(JSON.stringify({result: "OK"}));
    },

    showDevices: async (req, res) => {
        const relayLogs = await core.db.relayLog.getAll(30);
        const devices = await core.db.device.getAll();
        const deviceMap = {}
        for (device of devices) {
            deviceMap[device['id']] = device
            device['actions'] = await core.db.action.getActionsForDevice(device['id'])
        }
        core.renderer.render(req, res, "/device/device.html", {devices: devices, deviceMap: deviceMap, relayLogs: relayLogs, moment: moment});
    },

    showSensors: async (req, res) => {
        const devices = await core.db.device.getByType("thermo");
        for (device of devices) {
            const temperatures = await core.db.temperature.getLastKnownTemperature(device['id'], 1)
            if (temperatures.length > 0) {
                device['temperature'] = temperatures[0]['temperature'];
            } else {
                device['temperature'] = null;
            }
        }
        core.renderer.render(req, res, "/device/sensors.html", {devices: devices, moment: moment});
    },

    saveSensors: async (req, res) => {
        const ids = req.body["device_id"]
        const names = req.body["device_name"]
        for (let i = 0; i < ids.length; i++) {
            await core.db.device.setDeviceName(ids[i], names[i])
        }
        res.redirect(302, "/sensors");
    },

    saveDevices: async (req, res) => {
        console.log(req.body);
        const deviceId = req.body['device-id']

        if (req.body['block-device']) {
            await core.db.device.setState(deviceId, "blocked");
        } else if (req.body['unblock-device']) {
            await core.db.device.setState(deviceId, "off");
        }

        if (req.body['delete-action']) {
            const actionId = req.body['delete-action']
            await core.db.action.deleteAction(deviceId, actionId);
        }

        if (req.body['add-schedule']) {
            const from = req.body['schedule-from']
            const to = req.body['schedule-to']
            const state = req.body['schedule-state']
            await core.db.action.addAction(deviceId, 'schedule', from, to, state);
        }

        if (req.body['link-device']) {
            const sensorId = req.body['sensor-id']
            const from = req.body['sensor-time-from']
            const to = req.body['sensor-time-to']
            const sensorMin = req.body['sensor-min-value']
            const sensorMax = req.body['sensor-max-value']
            const state = req.body['schedule-state']
            await core.db.action.addAction(deviceId, 'sensor', from, to, state, sensorId, sensorMin, sensorMax);
        }

        if (req.body['enable-device']) {
            const minutes = req.body['enable-minutes']
            await core.db.action.addActionEnabled(deviceId, 'switcher', minutes);
        }
        await core.controller.relay.internal.checkState();
        res.redirect(302, "/devices");
    }
}