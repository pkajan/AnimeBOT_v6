require('./i18n'); //load i18n settings
const fs = require('fs-extra');
const Discord = require('discord.js');
const { prefix, token, activityType, activityName } = require('../config/config.json');
const config = require('../config/config.json'); //file with config
const log = require('./logger.js');
const basic = require('./functions_basic');
const baseAppPATH = __dirname.substring(0, __dirname.lastIndexOf('\\'));

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./app/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`../app/commands/${file}`);
    client.commands.set(command.name, command);

    var alternativeCMD = basic.delEmpty(command.altnames.split(";")); // remove empty from array to prevent command assignment to empty string
    alternativeCMD.forEach(element => {
        client.commands.set(element, command); // add alternative commands
    });
}
/*console.log("Command list:");
console.log(commandFiles.map(x => {
    return x.replace('.js', '');
}));
*/
//global.i18n = i18n;
client.once('ready', () => {
    log.info(i18n.__("ready"));
    client.user.setPresence({ activity: { type: activityType.toUpperCase(), name: activityName } })
        .then(log.info(i18n.__("set_status_log", activityType.toUpperCase(), activityName)))
        .catch(e => log.error(e));
});

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
    } else {
        log.info(i18n.__("commandNaN", command));
    }

})

/* Error handling */
client.on('error', error => {
    log.error(i18n.__("----------"));
    log.error(i18n.__("error", error));
    log.error(i18n.__("----------"));
    console.log("Hello");
    setTimeout(() => { basic.resetNodemon(); }, 10000);
});

client.on('shardError', error => {
    log.error(i18n.__("----------"));
    log.error(i18n.__("websocket_err", error));
    log.error(i18n.__("----------"));
    setTimeout(() => { basic.resetNodemon(); }, 10000);
});


client.login(token);
