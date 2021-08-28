const log = require('./logger.js');

//description: 'Send message to channel with given ID'
module.exports.sendMSGID = function (channelID, MSGText, stuff = null) {
    global.client.channels.cache.get(channelID).send({ content: MSGText, files: stuff }).catch(error => log.error(error));
};

//description: 'Send and remove message in X seconds (from given channel)'
module.exports.selfDestructMSGID = function (channelID, MSGText, stuff = null, time) {
    global.client.channels.cache.get(channelID).send({ content: MSGText, files: stuff }).then(sentMessage => {
        sentMessage.delete({ timeout: time, reason: 'It had to be done.' });
    }).catch(error => log.error(error));
};

//description: 'Send reply to same channel'
module.exports.replyMSG = function (message, reply_text, stuff = null) {
    message.channel.send({ content: reply_text, files: stuff }).catch(error => log.error(error));
};

//description: 'Remove invoking message'
module.exports.removeCallMSG = function (message) {
    setTimeout(function () {
        try {
            message.delete();
        } catch (error) {
            log.error(error);
        }
    }, 1000)
};

//description: 'Send and remove message in X seconds'
module.exports.selfDestructReply = function (message, reply_text, stuff = null, time) {
    message.channel.send({ content: reply_text, files: stuff }).then(sentMessage => {
        setTimeout(function () {
            try {
                sentMessage.delete();
            } catch (error) {
                log.error(error);
            }
        }, time)
    }).catch(error => log.error(error));
};

//description: 'Send PM'
module.exports.sendPM = function (message, reply_text, stuff = null) {
    message.author.send({ content: reply_text, files: stuff }).catch(error => log.error(error));
};
