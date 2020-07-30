const log = require('../logger.js');
var path = require('path');
var scriptName = path.basename(__filename).substring(0, path.basename(__filename).lastIndexOf('.js'));

const CronJob = require('cron').CronJob;
function task() {
    var variable = 0;
    const job = new CronJob(`*/1 * * * *`, function () {
        log.info("task2 executed " + variable);
        variable++;
    });
    job.start();
}

task(); // start task
log.info(i18n.__("cron_started", scriptName));
