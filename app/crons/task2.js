const log = require('../logger.js');
const fetch = require('node-fetch');
const announce = require('../../announce.json');
const basic = require('../functions_basic.js');
const discord = require('../functions_discord.js');
const { announceIDs } = require('../../config/config.json');
var path = require('path');
const { resolve } = require('path');
var scriptName = path.basename(__filename).substring(0, path.basename(__filename).lastIndexOf('.js'));

function checker(name, link, ep, picture) {
    const knownErr = [
        `<h1 class="entry-title">404</h1>`, //gogoanime
        `somethingSomethingDarkSide`, //another web
        `somethingSomethinglightSide` //another web
    ];
    return new Promise(resolve => {
        resolve(
            fetch(`${link}`)
                .then(res => res)
                .then(data => {
                    var html = data.body._outBuffer.toString();
                    var code = data.status;

                    if (knownErr.some(r => html.includes(r)) && (code >= 200 & code <= 300)) {
                        return { "pass": false, 'name': name, 'link': link, 'ep': ep, "picture": picture };
                    }
                    if (code >= 200 & code <= 300) {
                        return { "pass": true, 'name': name, 'link': link, 'ep': ep, "picture": picture };
                    }
                    return { "pass": false, 'name': name, 'link': link, 'ep': ep, "picture": picture };
                })
        );
    });
}

const CronJob = require('cron').CronJob;
function task() {
    postMessage = (obj) => { return `\`\`\`fix\n ${obj.name} => ep${obj.ep} \`\`\`\n<${obj.link}>\n`; };
    var tmpPath = __dirname.substring(0, __dirname.lastIndexOf('\\'));
    var realPath = tmpPath.substring(0, tmpPath.lastIndexOf('\\'));
    const job = new CronJob(`*/1 * * * *`, function () {
        for (var i in announce) {
            var entry = announce[i];
            async function asyncCall() {
                var result = await checker(entry.name, entry.link, entry.ep, entry.picture);
                if (!result.pass) return;
                if (basic.readSYNC(realPath + '//announceFIN.txt').includes(result.link)) return;
                basic.delEmpty(announceIDs.split(";")).forEach(element => {
                    console.log(element);
                    discord.sendMSGID(element, postMessage(result), { files: [result.picture] });
                    basic.JSON_remove(realPath + '//announce.json', `${result.name}-ep${result.ep}`);
                    log.info(`${result.name}-ep${result.ep}` + " removed from announce");
                    basic.fwASYNC(realPath + '//announceFIN.txt', result.link + '\n');
                });
            }
            asyncCall();
        }
    });
    job.start();
}

task(); // start task
log.info(i18n.__("cron_started", scriptName));
