/*global i18n*/
const fs = require('fs-extra');
const log = require('./logger.js');
const { cron } = require('../config/config.json');
const cronFiles = fs.readdirSync('./app/crons').filter(file => file.endsWith('.js'));

//description: 'start cron tasks'
module.exports.cronStart = function () {
    if (!cron) {
        log.info(i18n.__("disabledCrons"));
        return;
    }
    log.info(i18n.__("activeCrons", cronFiles.join(", ")));
    /* delay start of cron task - to not start before everything is really loaded! */
    setTimeout(() => {
        cronFiles.forEach(filename => {
            require('./crons/' + filename);
        });
        log.info(i18n.__("startCrons"));
    }, 1000);
};
