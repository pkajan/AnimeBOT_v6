require('./i18n'); //load i18n settings
const fs = require('fs-extra');
const Discord = require('discord.js');
const discordfc = require('./functions_discord');
const log = require('./logger.js');
const basic = require('./functions_basic');
const crons = require('./crons.js');
const AI = require('./AI.js');
const config = require('../config/config.json'); //file with config
const { prefix, token, activityType, activityName } = require('../config/config.json');
const animes = require('../data/anime.json');

const baseAppPATH = process.cwd();
basic.announceFill(animes, baseAppPATH + '//announce.json'); // fill announce file
basic.fwSYNC(baseAppPATH + '//announceFIN.txt', "", "A");
basic.fwSYNC(baseAppPATH + '//data//responses.txt', "", "A");

const client = new Discord.Client();
client.commands = new Discord.Collection();

/* read files with commands and put it into array */
const commandFiles = fs.readdirSync('./app/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`../app/commands/${file}`);
    client.commands.set(command.name, command);

    var alternativeCMD = basic.delEmpty(command.altnames.split(";")); // remove empty from array to prevent command assignment to empty string
    alternativeCMD.forEach(element => {
        client.commands.set(element, command); // add alternative command names
    });
}
/* ON READY/start */
try {
    client.once('ready', () => {
        log.info(i18n.__("ready", client.user.username));
        /* set status of the bot */
        client.user.setPresence({ activity: { type: activityType.toUpperCase(), name: activityName } })
            .then(log.info(i18n.__("set_status_log", activityType.toUpperCase(), activityName)))
            .catch(e => log.error(e));

        /* start cron tasks */
        crons.cronStart();
    });
} catch (err) {
    log.error("----------");
    log.error(i18n.__("error", JSON.stringify(err)));
    log.error("----------");
}


/* ON MESSAGE */
client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return; //ignore messages from other bots

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (basic.isEmpty(command)) return; // empty command

    var data = { "message": message, "client": client, "config": config, "prefix": prefix, "baseAppPATH": baseAppPATH };

    //commands executions
    if (client.commands.has(command)) {
        log.info(i18n.__("commandPASS", command));
        client.commands.get(command).execute(data, args);
        discordfc.removeCallMSG(message); // remove command call
    } else {
        log.info(i18n.__("commandNaN", command));
    }
});

if (AI) { /* ON MESSAGE AI branch*/
    client.on('message', message => {
        if (message.content.startsWith(prefix) || message.author.bot) return; //ignore messages from other bots and pre commands
        AI.AIStart(message);
    });
} else {
    log.info(i18n.__("disabledAI"));
}


/* Error handling */
client.on('error', err => {
    log.error("----------");
    log.error(i18n.__("error", JSON.stringify(err)));
    log.error("----------");
    setTimeout(() => { basic.resetNodemon(); }, 10000);
});

client.on('shardError', err => {
    log.error("----------");
    log.error(i18n.__("websocket_err", JSON.stringify(err)));
    log.error("----------");
    setTimeout(() => { basic.resetNodemon(); }, 10000);
});

client.login(token);
global.client = client; //usage outside of the box
global.images = basic.filesInFolder(baseAppPATH + "\\images");
global.txtResponses = basic.delEmpty(basic.readSYNC(baseAppPATH + '\\data\\responses.txt').split("\n"));
