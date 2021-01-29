const fs = require('fs-extra');
const fetch = require('node-fetch');
const log = require('./logger.js');
const baseAppPATH = __dirname.substring(0, __dirname.lastIndexOf('\\'));;
const date = require('date-and-time');
const ordinal = require('date-and-time/plugin/ordinal');
date.plugin(ordinal);
const calc = require('../app/functions_calculators.js');
const { testing_mode } = require('../config/config.json');

//description: 'remove accents/diacritics'
module.exports.deunicode = function (any_string) {
    return `${any_string}`.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
};

//description: 'parse strings with %s'
module.exports.parse = function (str, arg) {
    return str.replace(/%s/gi, arg);
};

//Download url content
module.exports.download = function (url, destination, json = false) {
    if (json == true) {
        fetch(url)
            .then(res => res.text())
            .then(body => {
                if (this.isJson(body) == true) {
                    fetch(url)
                        .then(res => {
                            const dest = fs.createWriteStream(destination);
                            res.body.pipe(dest)
                        }).catch(error => log.error(error));
                } else {
                    log.error(i18n.__("download_not_a_json", url));
                }
            }).catch(error => log.error(error));;
    } else {
        fetch(url)
            .then(res => {
                const dest = fs.createWriteStream(destination);
                res.body.pipe(dest)
            }).catch(error => log.error(error));
    }

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
    var value = true;
    for (var j = 0; j < Object.keys(jsonObj).length; j++) {
        value = false;
    }
    return value;
};

// remove empty("" / '') and null from array
module.exports.delEmpty = function (arr) {
    return arr.filter(function (e) { return e === 0 || e }).filter(val => val !== "undefined");
};

// restart sponsored by NODEMON
module.exports.resetNodemon = function () {
    log.info("Restart...");
    fs.writeFile(baseAppPATH + "\\data\\_.RESET", '', function (err) {
        if (err) return log.error(err);
    });
};

// announce filler
module.exports.announceFill = function (animes, realPath) {
    for (var j = 0; j < Object.keys(animes).length; j++) {
        var i = Object.keys(animes)[j];
        var entryDate = date.parse(`${animes[`${i}`].year}-${calc.fixDubleDigits(animes[`${i}`].month)}-${calc.fixDubleDigits(animes[`${i}`].day)}`, 'YYYY-MM-DD');
        var newData = calc.NewRelease(entryDate, 7, parseInt(animes[`${i}`]._starting_episode) - parseInt(animes[`${i}`]._skipped_episodes), animes[`${i}`]._last_episode);
        var name = i;
        var dayDiff = parseInt(newData.differenceDAYS);
        var link = this.parse(animes[`${i}`].link, newData.startEP);
        var picture = animes[`${i}`].picture;
        var ep = newData.startEP;
        var ended = (ep > animes[`${i}`]._last_episode ? true : false);
        var tmpDATA = { 'name': name, 'link': link, 'ep': ep, "picture": picture, "ended": ended };

        if (dayDiff == 0 && ep <= parseInt(animes[`${i}`]._last_episode)) {
            this.JSON_edit(realPath, `${name}-ep${ep}`, tmpDATA);
            log.info(i18n.__("cron_1_add", name, ep));
        }
    }
};

// check if given link exist on internet
module.exports.checker = function (name, link, ep, picture) {
    var userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0";
    const knownErr = require('../data/knownErr.json');
    const exist = { "pass": true, 'name': name, 'link': link, 'ep': ep, "picture": picture };
    const notexist = { "pass": false, 'name': name, 'link': link, 'ep': ep, "picture": picture };
    async function asyncCall() {
        var code = await fetch(link, { "headers": { "user-agent": userAgent } })
            .then(res => res.status)
            .catch(err => log.error(`${name}, ${err.code}, ${link}`));
        if (typeof code == 'undefined') return notexist; // if page doesnt exist dont waste time trying to get html...
        var html = await fetch(link, { "headers": { "user-agent": userAgent } })
            .then(res => res.text())
            .then(body => {
                if (testing_mode) {
                    log.info("HTML: " + body);
                };
                return body;
            })
            .catch(err => log.error(`${name}, ${err.code}, ${link}`));

        if (!(code >= 200 & code <= 300)) return notexist;
        var knowns = null;
        Object.keys(knownErr).forEach(function (k) {
            if (html.includes(knownErr[k])) { //known err filter (not all pages return err code to determine page doesnt exist)
                knowns = true;
            }
        });
        if (knowns) return notexist;

        if (code >= 200 & code <= 300) {
            return exist;
        }
        return notexist;
    }

    return new Promise(resolve => {
        resolve(
            asyncCall()
        );
    });
};

// return random element from array
module.exports.pickRandom = function (arr) {
    return arr[(Math.random() * arr.length) | 0];
};

// return true or false based on percentage chance
module.exports.percentChance = function (percent) {
    return (parseInt(Math.random() * 100)) >= (100 - percent) ? true : false;
};

// return all files from given folder as array
module.exports.filesInFolder = function (directory, remove = null) {
    var tmp = fs.readdirSync(directory).filter(arrayItem => arrayItem !== "info.txt");
    var returningArray = [];
    tmp.forEach(value => {
        returningArray.push(directory + "\\" + value);
    });
    return returningArray;
};

// return array with only uniq values (remove duplicates)
module.exports.removeDuplicates = function (array) {
    return Array.from(new Set(array));
};

// return if given string is Json or not
module.exports.isJson = function (string) {
    try {
        JSON.parse(string);
    } catch (e) {
        return false;
    }
    return true;
};

module.exports.ninegagCorrector = function (string) {
    const regex = /https:\/\/comment.*9gag.*#/gm;
    return string.replace(regex, '');
};
