const fs = require('fs-extra');
const fetch = require('node-fetch');
const log = require('./logger.js');
const baseAppPATH = __dirname.substring(0, __dirname.lastIndexOf('\\'));;
const date = require('date-and-time');
require('date-and-time/plugin/ordinal');
date.plugin('ordinal');
const calc = require('../app/functions_calculators.js');

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
    fetch(url)
        .then(res => {
            const dest = fs.createWriteStream(destination);
            res.body.pipe(dest)
        });
};

//read JSON and return results as object
module.exports.JSON_read = function (filename) {
    var data;
    try {
        data = fs.readFileSync(filename, 'utf8').toString(); //read data
        if (data == "") {
            data = "{}";
        }
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
    fs.writeFileSync(filename, JSON.stringify(obj, null, 4)); // write back to file
};

//ASYNC write into file
module.exports.fwASYNC = function (filepath, data) {
    fs.appendFile(filepath, data, null,
        // callback function
        function (err) {
            if (err) { throw err; }
        });
};

//SYNC write into file
module.exports.fwSYNC = function (filepath, data, type = null) {
    switch (type) {
        case ("A"): //append
            fs.appendFileSync(filepath, data, null);
            break;
        default:
            fs.writeFileSync(filepath, data, null);
    }
};

//SYNC read file to string
module.exports.readSYNC = function (filepath) {
    return fs.readFileSync(filepath, 'utf8');
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

// announce filler
module.exports.announceFill = function (animes, realPath) {
    for (var i in animes) {
        var entryDate = date.parse(`${animes[`${i}`].year}-${calc.fixDubleDigits(animes[`${i}`].month)}-${calc.fixDubleDigits(animes[`${i}`].day)}`, 'YYYY-MM-DD');
        var newData = calc.NewRelease(entryDate, 7, parseInt(animes[`${i}`]._starting_episode) - parseInt(animes[`${i}`]._skipped_episodes), animes[`${i}`]._last_episode);
        var name = i;
        var dayDiff = parseInt(newData.differenceDAYS);
        var link = this.parse(animes[`${i}`].link, newData.startEP);
        var picture = animes[`${i}`].picture;
        var ep = newData.startEP;
        var tmpDATA = { 'name': name, 'link': link, 'ep': ep, "picture": picture };

        if (dayDiff == 0) {
            this.JSON_edit(realPath, `${name}-ep${ep}`, tmpDATA);
            log.info(i18n.__("cron_1_add", name, ep));
        }
    }
};

// check if given link exist on internet
module.exports.checker = function (name, link, ep, picture) {
    const knownErr = [
        `<h1 class="entry-title">404</h1>`, //gogoanime
        `somethingSomethingDarkSide`, //another web
        `somethingSomethinglightSide` //another web
    ];
    return new Promise(resolve => {
        resolve(
            fetch(`${link}`)
                .then(res => res)
                .then(data => {
                    console
                    if (typeof data.body._outBuffer == 'undefined') {
                        return { "pass": false, 'name': name, 'link': link, 'ep': ep, "picture": picture };
                    }
                    var html = data.body._outBuffer.toString();
                    var code = data.status;

                    if (knownErr.some(r => html.includes(r)) && (code >= 200 & code <= 300)) {
                        return { "pass": false, 'name': name, 'link': link, 'ep': ep, "picture": picture };
                    }
                    if (code >= 200 & code <= 300) {
                        return { "pass": true, 'name': name, 'link': link, 'ep': ep, "picture": picture };
                    }
                    return { "pass": false, 'name': name, 'link': link, 'ep': ep, "picture": picture };
                })
        );
    });
};

// return random element from array
module.exports.pickRandom = function (arr) {
    return arr[(Math.random() * arr.length) | 0]
};
