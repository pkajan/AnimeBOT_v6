const fs = require('fs-extra');
const Discord = require('discord.js');
const i18n = require('i18n');
const { prefix, token, language } = require('../config/config.json');
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
}
/*console.log("Command list:");
console.log(commandFiles.map(x => {
    return x.replace('.js', '');
}));
*/


// minimal config i18n
i18n.configure({
    directory: __dirname + '/../locales',
    defaultLocale: language,
});
global.i18n = i18n;


client.once('ready', () => {
    log.info(i18n.__("ready"));
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    var data = { "message": message, "client": client, "config": config, "prefix": prefix, "baseAppPATH": baseAppPATH };


    if (client.commands.has(command)) {
        log.info(i18n.__("commandPASS", command));
        client.commands.get(command).execute(data, args);
    } else {
        log.info(i18n.__("commandNaN"));
    }

})


client.on('shardError', error => {
    log.error(i18n.__("websocket_err"));
    console.error('A websocket connection encountered an error:', error);
});


client.login(token);
