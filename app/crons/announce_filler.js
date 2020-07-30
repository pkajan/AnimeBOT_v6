const date = require('date-and-time');
require('date-and-time/plugin/ordinal');
date.plugin('ordinal');
const log = require('../logger.js');
const animes = require('../../data/anime.json');
const basic = require('../functions_basic.js');
const calc = require('../functions_calculators.js');
var path = require('path');
var scriptName = path.basename(__filename).substring(0, path.basename(__filename).lastIndexOf('.js'));

const CronJob = require('cron').CronJob;
function task() {
    var tmpPath = __dirname.substring(0, __dirname.lastIndexOf('\\'));
    var realPath = tmpPath.substring(0, tmpPath.lastIndexOf('\\')) + '//announce.json';

    const job = new CronJob(`*/1 * * * *`, function () {
        for (var i in animes) {
            var entryDate = date.parse(`${animes[`${i}`].year}-${calc.fixDubleDigits(animes[`${i}`].month)}-${calc.fixDubleDigits(animes[`${i}`].day)}`, 'YYYY-MM-DD');
            var newData = calc.NewRelease(entryDate, 7, parseInt(animes[`${i}`]._starting_episode) - parseInt(animes[`${i}`]._skipped_episodes), animes[`${i}`]._last_episode);
            var name = i;
            var dayDiff = parseInt(newData.differenceDAYS);
            var link = basic.parse(animes[`${i}`].link, newData.startEP);
            var checkTo = basic.parse(animes[`${i}`].checkTo, newData.startEP);
            var picture = animes[`${i}`].picture;
            var ep = newData.startEP;
            var tmpDATA = { 'name': name, 'link': link, 'ep': ep, "picture": picture, "checkTo": checkTo };

            if (dayDiff == 0) {
                basic.JSON_edit(realPath, name, tmpDATA);
                log.info(i18n.__("cron_1_add", name, ep));
            }
        }
    });
    job.start();
    log.info(i18n.__("cron_started", scriptName));
}

task(); // start task