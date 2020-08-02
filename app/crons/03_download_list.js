const log = require('../logger.js');
const basic = require('../functions_basic.js');
const { onlineList } = require('../../config/config.json');
const cronSettings= `0 2 * * *`;
var path = require('path');
var scriptName = path.basename(__filename).substring(0, path.basename(__filename).lastIndexOf('.js'));

const CronJob = require('cron').CronJob;
function task() {
    var tmpPath = __dirname.substring(0, __dirname.lastIndexOf('\\'));
    var realPath = tmpPath.substring(0, tmpPath.lastIndexOf('\\')) + "//data//anime.json";

    const job = new CronJob(cronSettings, function () {
        if (onlineList.download == true) {
            basic.download(onlineList.url, realPath);
            log.info("cron_3_success");
        }
    });
    job.start();
}

task(); // start task
log.info(i18n.__("cron_started", scriptName, cronSettings));

