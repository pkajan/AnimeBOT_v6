const log = require('../logger.js');
const animes = require('../../data/anime.json');
const basic = require('../functions_basic.js');
var path = require('path');
const cronSettings = `5 2 * * *`;
var scriptName = path.basename(__filename).substring(0, path.basename(__filename).lastIndexOf('.js'));

const CronJob = require('cron').CronJob;
function task() {
    var tmpPath = __dirname.substring(0, __dirname.lastIndexOf('\\'));
    var realPath = tmpPath.substring(0, tmpPath.lastIndexOf('\\')) + '//announce.json';

    const job = new CronJob(cronSettings, function () {
        basic.announceFill(animes, realPath);
    });
    job.start();
}

task(); // start task
log.info(i18n.__("cron_started", scriptName, cronSettings));
