const fs = require('fs-extra');
const util = require('util');
const request = require('node-fetch');
const date = require('date-and-time');


module.exports = {
    name: 'fwASYNC',
    description: 'ASYNC write into file',
    execute(filepath, data) {
        //function
    },


};


/*


const date = require('date-and-time');

var date1_str = {"year":2020,"month":7,"day":25};

var date1 = date.parse(`${date1_str.year}-${date1_str.month}-${date1_str.day}`, 'YYYY-M-DD');


const now = new Date();

var plusSeven = date.addDays(date1,7);
var diffD = date.subtract(date1,now).toDays();
var diffH = date.subtract(date1,now).toHours()

console.log(plusSeven);

console.log(diffD,diffH);

*/