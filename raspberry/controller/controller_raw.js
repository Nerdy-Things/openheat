const moment = require("moment")

module.exports = {
    showRaw: async(req, res) => {
        const roundedTime = core.util.datetime.roundNowToNext5Minutes();

        const endDate = core.util.datetime.formatToSQL(roundedTime);
        const startDate = core.util.datetime.formatToSQL(roundedTime.subtract(2, 'days'));

        const temperatures = await core.db.temperature.getTemperature(startDate, endDate, 10000);
        const temperatureGrouped = {}

        const devices = await core.db.device.getAll();
        const deviceMap = {}
        for (device of devices) {
            deviceMap[device['id']] = device
        }

        temperatures.forEach(temperature => {
            if (!temperatureGrouped[temperature['device_id']]) {
                temperatureGrouped[temperature['device_id']] = []
            }
            const date = moment(new Date(temperature.actual_time));
            const formattedDate = date.format("HH:mm:ss DD.MM.YYYY");
            temperature.time = formattedDate;
            temperatureGrouped[temperature['device_id']].push(temperature);
        });
        core.renderer.render(req, res, "/raw/raw.html", {temperatureGrouped: temperatureGrouped, deviceMap: deviceMap});
    },
}