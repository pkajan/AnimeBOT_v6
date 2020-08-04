const fs = require('fs-extra');
const log = require('./logger.js');
const discord = require('../app/functions_discord.js');
const basic = require('../app/functions_basic.js');
const { invoke, replies, exceptions } = require('../data/AI.json');
const date = require('date-and-time');
require('date-and-time/plugin/ordinal');
date.plugin('ordinal');


//description: 'start AI tasks'
module.exports.AIStart = function (message) {
    var now = date.format(new Date(), 'H'); // actual hour
    var message_array = message.content.split(/ +/);
    var msg_part = basic.delEmpty([message_array[0], message_array[1], message_array[2]]); // max first 3 words

    if (msg_part.some(el => invoke.greetings.includes(basic.deunicode(el)))
        || invoke.greetings.includes(basic.deunicode(`${message_array[0]} ${message_array[1]}`))
        || invoke.greetings.includes(basic.deunicode(`${message_array[0]} ${message_array[1]} ${message_array[2]}`))) { //greetings
        switch (true) {
            case (now >= 0 && now <= 9): //morning
                discord.replyMSG(message, basic.pickRandom(replies.greetings_morning));
                break;
            case (now > 18 && now <= 23): //evening
                discord.replyMSG(message, basic.pickRandom(replies.greetings_evening));
                break;
            default: //generic
                discord.replyMSG(message, basic.pickRandom(replies.greetings));
        }
        log.info(i18n.__("AI_reply_greetings", message.author.username.toString()));
        return;
    }

    if (msg_part.some(el => invoke.goodnights.includes(basic.deunicode(el)))
        || invoke.goodnights.includes(basic.deunicode(`${message_array[0]} ${message_array[1]}`))
        || invoke.goodnights.includes(basic.deunicode(`${message_array[0]} ${message_array[1]} ${message_array[2]}`))) { //goodnights
        discord.replyMSG(message, basic.pickRandom(replies.goodnights));
        log.info(i18n.__("AI_reply_goodnights", message.author.username.toString()));
        return;
    }

    if (msg_part.some(el => invoke.goodbyes.includes(basic.deunicode(el)))
        || invoke.goodbyes.includes(basic.deunicode(`${message_array[0]} ${message_array[1]}`))
        || invoke.goodbyes.includes(basic.deunicode(`${message_array[0]} ${message_array[1]} ${message_array[2]}`))) { //goodbyes
        discord.replyMSG(message, basic.pickRandom(replies.goodbyes));
        log.info(i18n.__("AI_reply_goodbyes", message.author.username.toString()));
        return;
    }
};
