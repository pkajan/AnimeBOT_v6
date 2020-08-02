const log = require('../logger.js');
var announce = require('../../announce.json');
const basic = require('../functions_basic.js');
const discord = require('../functions_discord.js');
const { announceIDs } = require('../../config/config.json');
var path = require('path');
const { resolve } = require('path');
const cronSettings = `*/20 * * * *`;
var scriptName = path.basename(__filename).substring(0, path.basename(__filename).lastIndexOf('.js'));

const CronJob = require('cron').CronJob;
function task() {
    postMessage = (obj) => { return `\`\`\`fix\n ${obj.name} => ep${obj.ep} \`\`\`\n<${obj.link}>\n`; };
    var tmpPath = __dirname.substring(0, __dirname.lastIndexOf('\\'));
    var realPath = tmpPath.substring(0, tmpPath.lastIndexOf('\\'));
    const job = new CronJob(cronSettings, function () {
        delete require.cache[require.resolve('../../announce.json')]   // Deleting loaded module
        announce = require('../../announce.json');
        for (var i in announce) {
            var entry = announce[i];
            async function asyncCall() {
                var result = await basic.checker(entry.name, entry.link, entry.ep, entry.picture);
                if (!result.pass) {
                    log.info(i18n.__("cron_2_wait", `${result.name}-ep${result.ep}`));
                    return;
                }
                if (basic.readSYNC(realPath + '//announceFIN.txt').includes(result.link)) return;
                basic.delEmpty(announceIDs.split(";")).forEach(element => {
                    discord.sendMSGID(element, postMessage(result), { files: [result.picture] });
                    basic.JSON_remove(realPath + '//announce.json', `${result.name}-ep${result.ep}`);
                    log.info(i18n.__("cron_2_success", `${result.name}-ep${result.ep}`, element));
                });
                log.info(i18n.__("cron_2_removed", `${result.name}-ep${result.ep}`));
                basic.fwASYNC(realPath + '//announceFIN.txt', result.link + '\n');
            }
            asyncCall();
        }
    });
    job.start();
}

task(); // start task
log.info(i18n.__("cron_started", scriptName, cronSettings));
