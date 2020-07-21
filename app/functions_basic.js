const fs = require('fs-extra');
const util = require('util');
const request = require('node-fetch');
const date = require('date-and-time');

//description: 'remove accents/diacritics'
module.exports.deunicode = function (any_string) {
    return any_string.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
};

//Download url content
module.exports.download = function (url, destination) {
    request(url)
        .pipe(fs.createWriteStream(destination));
};

//add or edit given element in JSON object
module.exports.JSON_edit = function (filename, elem, data) {
    var obj = this.JSON_read(filename); //read data
    obj[`${elem}`] = data; // add/edit element
    fs.writeFileSync(filename, JSON.stringify(obj, null, 4)); // write back to file
};

//remove given element from JSON object
module.exports.JSON_remove = function (filename, elem) {
    var obj = this.JSON_read(filename); //read data
    delete obj[`${elem}`]; // remove element
    fs.writeFileSync(filename, JSON.stringify(obj)); // write back to file
};

//ASYNC write into file
module.exports.fwASYNC = function (filepath, data) {
    fs.appendFile(filepath, data, null,
        // callback function
        function (err) {
            if (err) { throw err; }
        });
};

//read JSON and return results as object
module.exports.JSON_read = function (filename) {
    var data;
    try {
        data = fs.readFileSync(filename, 'utf8').toString(); //read data
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('File not found!');
            data = "{}"
        } else {
            throw err;
        }
    }
    return JSON.parse(data); //parse - create object
};
