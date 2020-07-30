const log = require('../logger.js');
const fetch = require('node-fetch');
const announce = require('../../announce.json');
const basic = require('../functions_basic.js');
var path = require('path');
var scriptName = path.basename(__filename).substring(0, path.basename(__filename).lastIndexOf('.js'));

function checker(link, name, picture) {
    const knownErr = [
        `<h1 class="entry-title">404</h1>`, //gogoanime
        `somethingSomethingDarkSide`, //another web
        `somethingSomethinglightSide` //another web
    ];
    fetch(`${link}`)
        .then(res => res)
        .then(data => {
            var html = data.body._outBuffer.toString();
            var code = data.status;

            if (knownErr.some(r => html.includes(r)) && (code >= 200 & code <= 300)) {
                console.log(name, false, link);
                return false;
            }
            if (code >= 200 & code <= 300) {
                console.log(name, true, link, picture);
                return true;
            }
        });
}
const CronJob = require('cron').CronJob;
function task() {

    const job = new CronJob(`*/1 * * * *`, function () {
        for (var i in announce) {
            var entry = announce[i];
            /*console.log(entry.name);
            console.log(entry.link);
            console.log(entry.checkTo);*/
            checker(entry.checkTo, entry.name, entry.picture);
            console.log("----------------");
        }
    });
    job.start();
}

task(); // start task
log.info(i18n.__("cron_started", scriptName));
