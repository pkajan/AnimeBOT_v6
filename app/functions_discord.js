const basic = require('./functions_basic.js');
const log = require('./logger.js');
const client = global.client;

//description: 'Send message to channel with given ID'
module.exports.sendMSGID = function (channelID, MSGText, stuff=null) {
    client.channels.cache.get(channelID).send(MSGText, stuff);
};

//description: 'Send reply to same channel'
module.exports.replyMSG = function (message, reply_text, additional = null) {
    message.channel.send(reply_text, additional);
};

//description: 'Remove invoking message'
module.exports.removeCallMSG = function (message) {
    message.delete({ timeout: 1000, reason: 'It had to be done.' }).catch(error => log.error(error));
};

//description: 'Send and remove message in X seconds'
module.exports.selfDestructMSG = function (message, MSGText, time, cmd_name = null) {
    message.channel.send(MSGText).then(sentMessage => {
        sentMessage.delete({ timeout: time, reason: 'It had to be done.' }).catch(error => log.error(error));
    });
};

//description: 'Send and remove message in X seconds (from given channel)'
module.exports.selfDestructMSGID = function (channelID, MSGText, time, user = null, cmd_name = null) {
    if (MSGText == "" || MSGText == null || MSGText == "\n") {
        log.info("msg_empty");
    } else {
        client.channels.get(channelID).send(MSGText).then(sentMessage => {
            sentMessage.delete(time).catch(error => log.error(error));
        });
        log.info("send_selfdestructid");
    }
};
