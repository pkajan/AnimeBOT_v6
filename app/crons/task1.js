const log = require('../logger.js');
const CronJob = require('cron').CronJob;
function task() {
    var variable = 0;
    const job = new CronJob(`*/1 * * * *`, function () {
        log.info("task1 executed " + variable);
        variable++;
    });
    job.start();
}

task(); // start task
