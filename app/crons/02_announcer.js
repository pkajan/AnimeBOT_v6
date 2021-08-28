/*global i18n*/
const log = require('../logger.js');
var announce = require('../../announce.json');
const basic = require('../functions_basic.js');
const discord = require('../functions_discord.js');
const { announceIDs } = require('../../config/config.json');
const path = require('path');
const cronSettings = `*/20 * * * *`;
var scriptName = path.basename(__filename).substring(0, path.basename(__filename).lastIndexOf('.js'));

async function asyncCall(entry, realPath, postMessage) {
    var result = await basic.checker(entry.name, entry.link, entry.ep, entry.picture);
    if (!result.pass) {
        log.info(i18n.__("cron_2_wait", `${result.name}-ep${result.ep}`));
        return;
    }
    if (basic.readSYNC(path.normalize(path.join(realPath, 'announceFIN.txt'))).includes(result.link)) {
        basic.JSON_remove(path.normalize(path.join(realPath, 'announce.json')), `${result.name}-ep${result.ep}`); //if already posted remove
        log.info(i18n.__("cron_2_success_repeated", `${result.name}-ep${result.ep}`));
        return;
    }
    basic.delEmpty(announceIDs.split(";")).forEach(element => {
        discord.sendMSGID(element, postMessage(result), [result.picture]);
        basic.JSON_remove(path.normalize(path.join(realPath, 'announce.json')), `${result.name}-ep${result.ep}`);
        log.info(i18n.__("cron_2_success", `${result.name}-ep${result.ep}`, element));
    });
    log.info(i18n.__("cron_2_removed", `${result.name}-ep${result.ep}`));
    basic.fwASYNC(path.normalize(path.join(realPath, 'announceFIN.txt')), result.link + '\n');
}

const CronJob = require('cron').CronJob;

function task() {
    var postMessage = (obj) => { return `\`\`\`fix\n ${obj.name} => ep${obj.ep} \`\`\`\n<${obj.link}>\n`; };
    var tmpPath = __dirname.substring(0, __dirname.lastIndexOf('\\'));
    var realPath = tmpPath.substring(0, tmpPath.lastIndexOf('\\'));
    const job = new CronJob(cronSettings, function () {
        delete require.cache[require.resolve('../../announce.json')] // Deleting loaded module
        announce = require('../../announce.json');
        for (var j = 0; j < Object.keys(announce).length; j++) {
            var i = Object.keys(announce)[j];
            var entry = announce[i];

            asyncCall(entry, realPath, postMessage);
        }
    });
    job.start();
}

task(); // start task
log.info(i18n.__("cron_started", scriptName, cronSettings));
