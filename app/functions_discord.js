const things = require('./functions_basic.js');


module.exports = {
    name: 'removeCallMsg',
    description: 'Remove invoking message',
    execute(message) {
        message.delete().catch(error => things.log(things.translate("BOT_removeCallMsg_err")));
    },

    name: 'MSGReply',
    description: 'send reply to same channel',
    execute(message, reply_text, additional = null) {
        message.channel.send(reply_text, additional);
    },

    name: 'selfDestructMSG',
    description: 'Send and remove message in X seconds',
    execute(message, MSGText, time, cmd_name) {
        message.channel.send(MSGText).then(sentMessage => {
            sentMessage.delete(time).catch(error => things.log(things.translate("BOT_send_selfdestruct_err")));
        });
        things.log(things.translate("BOT_send_selfdestruct", message.author.username.toString(), cmd_name));
    },

    name: 'selfDestructMSGID',
    description: 'Send and remove message in X seconds (from given channel)',
    execute(client, channelID, MSGText, time, user = null, cmd_name) {
        if (MSGText == "" || MSGText == null || MSGText == "\n") {
            things.log(things.translate("msg_empty", user, cmd_name));
        } else {
            client.channels.get(channelID).send(MSGText).then(sentMessage => {
                sentMessage.delete(time).catch(error => things.log(things.translate("BOT_send_selfdestruct_err")));
            });
            things.log(things.translate("BOT_send_selfdestructid", user, cmd_name));
        }
    },

    name: 'sendMSGID',
    description: 'Send to channel with ID',
    execute(client, channelID, MSGText) {
        client.channels.get(channelID).send(MSGText)
        things.log(things.translate("BOT_send_sendMSGID", channelID));
    },

    name: 'SendtoAllGuilds',
    description: 'Send message to all servers (guilds) bot is in',
    execute(client, text, picture = null) {
        try {
            var animeDefaultChannels = config.animeDefaultChannels.split(";");
            var toSay = text;
            animeDefaultChannels.forEach(function (entry) {
                if (picture) {
                    client.channels.get(entry).send(toSay, { files: [picture] });
                } else {
                    client.channels.get(entry).send(toSay);
                }
                things.log(things.translate("BOT_send_all"));
            });
        } catch (err) {
            things.log(things.translate("BOT_could_not_send"));
        }
    },
};