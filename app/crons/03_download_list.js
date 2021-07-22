/*global i18n*/
const log = require('../logger.js');
const basic = require('../functions_basic.js');
const { onlineList } = require('../../config/config.json');
const cronSettings = `0 2 * * *`;
const path = require('path');
var scriptName = path.basename(__filename).substring(0, path.basename(__filename).lastIndexOf('.js'));
const baseAppPATH = process.cwd();

const CronJob = require('cron').CronJob;
function task() {
    const job = new CronJob(cronSettings, function () {
        if (onlineList.download == true) {
            basic.download(onlineList.url, path.normalize(path.join(baseAppPATH, "data", "anime.json")), true);
            log.info(i18n.__("cron_3_success"));
        }
    });
    job.start();
}

task(); // start task
log.info(i18n.__("cron_started", scriptName, cronSettings));

