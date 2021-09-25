/*global i18n*/
const log = require('../logger.js');
const discord = require('../functions_discord');
const { logfile } = require('../../config/config.json');
const path = require('path');
const statisticsPath = path.normalize(path.join(process.cwd(), 'statistics.json'));

module.exports = {
    name: 'log',
    altnames: i18n.__({ phrase: "__alt_cmd__log", locale: "custom" }),
    description: 'send logfile to PM',
    execute(data) {
        discord.sendPM(data.message, "text", [logfile]);
        log.info(i18n.__("cmd_log_msg_log", data.message.author.username.toString()));
        discord.sendPM(data.message, "text", [statisticsPath]);
        log.info(i18n.__("cmd_log_msg_stats", data.message.author.username.toString()));
    },
};
