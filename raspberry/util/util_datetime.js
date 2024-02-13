const moment = require("moment");

module.exports = {
    roundNowToNext5Minutes: () => {
        let now = moment();
        let remainder = 5 - (now.minute() % 5);
        // This condition checks if we're not exactly on a 5-minute mark.
        // If we are on a 5-minute mark, remainder will be 0, and we should add 5 minutes.
        if (remainder === 0) {
            remainder = 5;
        }
        now = now.add(remainder, 'minutes');
        now = now.startOf('minute'); // Sets seconds and milliseconds to 0
        return now;
    },

    formatToSQL: (date) => {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    }
}