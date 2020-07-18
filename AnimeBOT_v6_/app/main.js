const fs = require('fs-extra');
const Discord = require('discord.js');
const i18n = require('i18n');
const { prefix, token, language } = require('../config/config.json');
const config = require('../config/config.json'); //file with config

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./app/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`../app/commands/${file}`);
    client.commands.set(command.name, command);
}
console.log("Command list:");
console.log(commandFiles.map(x => {
    return x.replace('.js', '');
}));

// minimal config i18n
i18n.configure({
    directory: __dirname + '/../locales',
    defaultLocale: language,
});
global.i18n = i18n;
//console.log(i18n.__("Hello %s", "yolopod"));


client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    var data = { "message": message, "client": client, "config": config, "prefix": prefix, "skuska": "volacodaco" };

    if (client.commands.has(command)) {
        client.commands.get(command).execute(data, args);
        console.log("ppc prikaz");
    } else {
        console.log("neexistujuci prikaz");
    }

    // do the same for the rest of the commands...
})


client.login(token);
