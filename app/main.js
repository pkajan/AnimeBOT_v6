require('./i18n'); //load i18n settings
const fs = require('fs-extra');
const Discord = require('discord.js');
const discord = require('./functions_discord');
const log = require('./logger.js');
const basic = require('./functions_basic');
const crons = require('./crons.js');
const config = require('../config/config.json'); //file with config
const { prefix, token, activityType, activityName } = require('../config/config.json');
const animes = require('../data/anime.json');

const baseAppPATH = __dirname.substring(0, __dirname.lastIndexOf('\\'));
basic.fwASYNC(baseAppPATH + '//announce.json', "");
basic.fwASYNC(baseAppPATH + '//announceFIN.txt', "");

const client = new Discord.Client();
global.client = client; //usage outside of the box
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
client.once('ready', () => {
    log.info(i18n.__("ready"));
    /* set status of the bot */
    client.user.setPresence({ activity: { type: activityType.toUpperCase(), name: activityName } })
        .then(log.info(i18n.__("set_status_log", activityType.toUpperCase(), activityName)))
        .catch(e => log.error(e));

    /* start cron tasks */
    crons.cronStart();

    /* fill announce file */
    basic.announceFill(animes, baseAppPATH + '//announce.json')
});

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
        discord.removeCallMSG(message); // remove command call
    } else {
        log.info(i18n.__("commandNaN", command));
    }

})

/* Error handling */
client.on('error', error => {
    log.error("----------");
    log.error(i18n.__("error", error));
    log.error("----------");
    console.log("Hello");
    setTimeout(() => { basic.resetNodemon(); }, 10000);
});

client.on('shardError', error => {
    log.error("----------");
    log.error(i18n.__("websocket_err", error));
    log.error("----------");
    setTimeout(() => { basic.resetNodemon(); }, 10000);
});

client.login(token);
