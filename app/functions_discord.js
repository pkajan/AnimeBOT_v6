const basic = require('./functions_basic.js');
const log = require('./logger.js');

//description: 'Send message to channel with given ID'
module.exports.sendMSGID = function (channelID, MSGText, stuff = null) {
    global.client.channels.cache.get(channelID).send(MSGText, stuff).catch(error => log.error(error));
};

//description: 'Send and remove message in X seconds (from given channel)'
module.exports.selfDestructMSGID = function (channelID, MSGText, stuff = null, time) {
    global.client.channels.cache.get(channelID).send(MSGText, stuff).then(sentMessage => {
        sentMessage.delete({ timeout: time, reason: 'It had to be done.' });
    }).catch(error => log.error(error));
};

//description: 'Send reply to same channel'
module.exports.replyMSG = function (message, reply_text, additional = null) {
    message.channel.send(reply_text, additional).catch(error => log.error(error));
};

//description: 'Remove invoking message'
module.exports.removeCallMSG = function (message) {
    message.delete({ timeout: 1000, reason: 'It had to be done.' }).catch(error => log.error(error));
};

//description: 'Send and remove message in X seconds'
module.exports.selfDestructReply = function (message, reply_text, additional = null, time) {
    message.channel.send(reply_text, additional).then(sentMessage => {
        sentMessage.delete({ timeout: time, reason: 'It had to be done.' }).catch(error => log.error(error));
    });
};

//description: 'Send PM'
module.exports.sendPM = function (message, reply_text, additional = null) {
    message.author.send(reply_text,additional).catch(error => log.error(error));
};
