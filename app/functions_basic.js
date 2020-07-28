const fs = require('fs-extra');
const request = require('node-fetch');
const log = require('./logger.js');
const baseAppPATH = __dirname.substring(0, __dirname.lastIndexOf('\\'));;

//description: 'remove accents/diacritics'
module.exports.deunicode = function (any_string) {
    return any_string.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
};

//description: 'parse strings with %s'
module.exports.parse = function (str, arg) {
    return str.replace(/%s/gi, arg);
};

//Download url content
module.exports.download = function (url, destination) {
    request(url)
        .pipe(fs.createWriteStream(destination));
};

//read JSON and return results as object
module.exports.JSON_read = function (filename) {
    var data;
    try {
        data = fs.readFileSync(filename, 'utf8').toString(); //read data
    } catch (err) {
        if (err.code === 'ENOENT') {
            log.info(i18n.__("FileNotFound", filename));
            data = "{}"
        } else {
            throw err;
        }
    }
    return JSON.parse(data); //parse - create object
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

//test if json object is empty
module.exports.isEmpty = function (jsonObj) {
    for (var i in jsonObj) return false;
    return true;
};

// remove empty("" / '') and null from array
module.exports.delEmpty = function (arr) {
    return arr.filter(function (e) { return e === 0 || e });
};

// restart sponsored by NODEMON
module.exports.resetNodemon = function () {
    console.log(baseAppPATH + "\\data\\_.RESET");
    fs.writeFile(baseAppPATH + "\\data\\_.RESET", '', function (err) {
        if (err) return log.error(err);
    });
};
