const retus = require("retus"); //sync alternative to fetch
const log = require('./logger.js');

require('./i18n'); //load i18n settings

module.exports.tryInternet = function (url, timeout = 1000) {
    try {
        if (retus(url, { "timeout": timeout }).statusCode == 200) {
            log.info("InternetUP");
            return true;
        }
    } catch (err) {
        log.info("InternetDown");
        exports.tryInternet(url, timeout);
    }
}
