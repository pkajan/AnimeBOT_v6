const log = require('../logger.js');
const date = require('date-and-time');


module.exports = {
    name: 'calcDiffDays',
    description: 'calculate difference between dates in days',
    execute(date1, date2) {
        var firstDate = date.parse(`${date1.year}-${date1.month}-${date1.day}`, 'YYYY-M-DD');
        var SecondDate = date.parse(`${date2.year}-${date2.month}-${date2.day}`, 'YYYY-M-DD');

        return date.subtract(firstDate, SecondDate).toDays();
    },

    name: 'calcDiffHours',
    description: 'calculate difference between dates in hours',
    execute(date1, date2) {
        var firstDate = date.parse(`${date1.year}-${date1.month}-${date1.day}`, 'YYYY-M-DD');
        var SecondDate = date.parse(`${date2.year}-${date2.month}-${date2.day}`, 'YYYY-M-DD');

        return date.subtract(firstDate, SecondDate).toHours();
    },

};
