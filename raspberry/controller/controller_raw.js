const moment = require("moment")

module.exports = {
    showRaw: async(req, res) => {
        const roundedTime = core.util.datetime.roundNowToNext5Minutes();

        const endDate = core.util.datetime.formatToSQL(roundedTime);
        const startDate = core.util.datetime.formatToSQL(roundedTime.subtract(2, 'days'));

        const temperatures = await core.db.temperature.getTemperature(startDate, endDate, 10000);
        const devices = {}

        temperatures.forEach(temperature => {
            if (!devices[temperature['device_id']]) {
                devices[temperature['device_id']] = []
            }
            const date = moment(new Date(temperature.actual_time));
            const formattedDate = date.format("HH:mm:ss DD.MM.YYYY");
            temperature.time = formattedDate;
            devices[temperature['device_id']].push(temperature);
        });
        core.renderer.render(req, res, "/raw/raw.html", {devices: devices});
    },
}