const date = require('date-and-time');
const ordinal = require('date-and-time/plugin/ordinal');
date.plugin(ordinal);

//description: 'add set amount of days to timeobject'
module.exports.addDays = function (timeobj, number) {
    return date.addDays(timeobj, number);
};

//description: 'add 0 (zero) befor number if number is lower than 10'
module.exports.fixDubleDigits = function (number) {
    if (parseInt(number) < 10) {
        return `0${parseInt(number)}`;
    } else {
        return number;
    }
};

//description: 'recursively add days to date till its bigger or equal to todays'
module.exports.NewRelease = function (timeobject, daysPlus, startEP, lastEP) {
    var now = date.parse(date.format(new Date(), 'YYYY-MM-DD'), 'YYYY-MM-DD'); //current date
    var differenceDAYS = Math.ceil(date.subtract(timeobject, now).toDays());
    var tmpDATE = timeobject;
    if (differenceDAYS < 0 & startEP <= lastEP) {
        tmpDATE = this.addDays(timeobject, daysPlus);
        return this.NewRelease(tmpDATE, daysPlus, parseInt(startEP) + 1, lastEP);
    } else {
        return { "differenceDAYS": differenceDAYS, "startEP": startEP, "newDate": tmpDATE }
    }
};