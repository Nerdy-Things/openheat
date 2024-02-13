const moment = require("moment");

module.exports = {
    showGoogleCharts: async(req, res) => {
        let days = 3
        if (req.params && req.params.days) {
            days = parseInt(req.params.days)
        }
        
        const roundedTime = core.util.datetime.roundNowToNext5Minutes();

        const endDate = core.util.datetime.formatToSQL(roundedTime);
        const startDate = core.util.datetime.formatToSQL(roundedTime.subtract(days, 'days'));

        const devices = await core.db.device.getAll();
        const deviceMap = {}
        for (const device of devices) {
            deviceMap[device["id"]] = device;
        }
        const temperatures = await core.db.temperature.getTemperature(startDate, endDate, 10000);
        const relayLog = await core.db.relayLog.getAll(100);

        core.renderer.render(req, res, "/charts/charts_google.ejs", {
            startDate: startDate,
            endDate: endDate,
            temperatures: temperatures, 
            relayLog: relayLog,
            deviceMap: deviceMap,
            moment: moment,
        });
    }
}