const netTest = require('./internet_test.js');
netTest.tryInternet("https://1.1.1.1"); // wait till internet is UP

/*global i18n*/
require('./i18n'); //load i18n settings
const fs = require('fs-extra');
const { Client, Intents, Collection } = require('discord.js');
const discordfc = require('./functions_discord');
const log = require('./logger.js');
const basic = require('./functions_basic');
const crons = require('./crons.js');
const AI_function = require('./AI.js');
const stalking_function = require('./stalking.js');
const { prefix, token, activityType, activityName, AI, stalking, a9gagCorrector, testing_mode } = require('../config/config.json');
const animes = require('../data/anime.json');
const path = require('path');

const baseAppPATH = process.cwd();
const announcePath = path.normalize(path.join(baseAppPATH, 'announce.json'));
try {
    if (!fs.existsSync(announcePath)) {
        basic.fwSYNC(announcePath, "{}\n", "A");
    }
} catch (err) {
    log.info(err);
}
basic.announceFill(animes, announcePath); // fill announce file
basic.fwSYNC(path.normalize(path.join(baseAppPATH, 'announceFIN.txt')), "", "A");
basic.fwSYNC(path.normalize(path.join(baseAppPATH, 'data', 'responses.txt')), "", "A");

//logs
const { logfile } = require('../config/config.json');
var stats = fs.statSync(logfile)
var fileSizeInBytes = (stats.size / 1024) / 1024; //size in MB

if (fileSizeInBytes > 8) {
    var date_ob = new Date();
    var day = date_ob.getDate();
    var month = date_ob.getMonth() + 1;
    var year = date_ob.getFullYear();
    fs.rename(logfile, logfile + `_${year}-${month}-${day}_${date_ob / 1}.txt`, function (err) {
        if (err) throw err
        log.info(i18n.__("log_backup"));
    })
}

//statistics log
var curDate = new Date();
const stats_log_file = `${curDate.getFullYear()}_${curDate.getMonth()}_statistics.json`;
if (curDate.getDate() == 1) {
    try {
        if (!fs.existsSync(stats_log_file)) {
            fs.rename("statistics.json", `${curDate.getFullYear()}_${curDate.getMonth()}_statistics.json`, function (err) {
                if (err) throw err
                log.info(i18n.__("log_stats_backup"));
            })
        }
    } catch (err) {
        console.error(err)
    }
}

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILDS
);

const client = new Client({ intents: myIntents });
client.commands = new Collection();

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

/* put all commands into array */
var commandList = [];
client.commands.forEach(element => {
    if (!commandList[element.name]) {
        commandList[element.name] = element.altnames;
    } else {
        commandList[element.name] = basic.removeDuplicates((commandList[element.name] + ";" + element.altnames).split(";")).join(";");
    }
});

/* ON READY/start */
client.once('ready', () => {
    log.info(i18n.__("ready", client.user.username));
    log.info(i18n.__("prefix", prefix));

    /* set status of the bot */
    client.user.setPresence({ activities: [{ type: activityType.toUpperCase(), name: activityName }] })
    log.info(i18n.__("set_status_log", activityType.toUpperCase(), activityName));

    /* start cron tasks */
    crons.cronStart();
});

/* ON MESSAGE */
client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return; //ignore messages from other bots

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (basic.isEmpty(command)) return; // empty command

    var data = { "message": message, "client": client, "config": require('../config/config.json'), "prefix": prefix, "baseAppPATH": baseAppPATH, "commandList": commandList };

    //commands executions
    if (client.commands.has(command)) {
        log.info(i18n.__("commandPASS", command));
        client.commands.get(command).execute(data, args);
        discordfc.removeCallMSG(message); // remove command call
    } else {
        log.info(i18n.__("commandNaN", command));
    }
});

if (a9gagCorrector) { /* ON MESSAGE 9gag branch */
    client.on('messageCreate', message => {
        if (message.content.startsWith(prefix) || message.author.bot) return; //ignore messages from other bots and pre commands
        const regex = /https:\/\/comment.*9gag.*#/gm;
        if (regex.test(message.content)) {
            discordfc.replyMSG(message, basic.ninegagCorrector(message.content));
            discordfc.removeCallMSG(message);
            log.info(i18n.__("a9gag", message.author.username.toString()));
        }
    });
}

if (AI) { /* ON MESSAGE AI branch */
    client.on('messageCreate', message => {
        if (message.content.startsWith(prefix) || message.author.bot) return; //ignore messages from other bots and pre commands
        AI_function.AIStart(message);
    });
    log.info(i18n.__("enabledAI"));
} else {
    log.info(i18n.__("disabledAI"));
}

if (stalking) { /* stalking users */
    client.on('messageCreate', message => {
        stalking_function.StalkingMessages(message, "create");
    });
    client.on('messageUpdate', message => {
        stalking_function.StalkingMessages(message, "edit");
    });
    client.on('messageDelete', message => {
        stalking_function.StalkingMessages(message, "delete");
    });

    log.info(i18n.__("enabledStalking"));
} else {
    log.info(i18n.__("disabledStalking"));
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

if (!testing_mode) {
    process.on('unhandledRejection', err => {
        log.error("-----unhandledRejection-----");
        log.error(i18n.__("error", JSON.stringify(err)));
        log.error("----------");
        setTimeout(() => { basic.resetNodemon(); }, 10000);
    });
}

client.login(token);
global.client = client; //usage outside of the box
global.images = basic.filesInFolder(path.normalize(path.join(baseAppPATH, "images")));
global.txtResponses = basic.delEmpty(basic.readSYNC(path.normalize(path.join(baseAppPATH, 'data/responses.txt'))).split("\n"));
