const log = require('./logger.js');
const path = require('path');
const fs = require('fs-extra');
const basic = require('./functions_basic');
const date = require('date-and-time');
const ordinal = require('date-and-time/plugin/ordinal');
date.plugin(ordinal);
var messageCounter = {};
var UserName = "user";
const statisticsPath = path.normalize(path.join(process.cwd(), 'statistics.json'));
try {
    if (!fs.existsSync(statisticsPath)) {
        basic.fwSYNC(statisticsPath, "{}\n", "A");
    }
} catch (err) {
    log.info(err);
}

messageCounter = basic.JSON_read(statisticsPath);

//description: 'start stalking messages'
module.exports.StalkingMessages = function (message, ActionType) {
    async function getName() {
        return message.author.username.toString();
    }
    getName().then(user => {
        UserName = user;
        messageCounter[UserName] = {
            "posted": (typeof (messageCounter[UserName]) !== 'undefined') ? messageCounter[UserName].posted : 0,
            "edited": (typeof messageCounter[UserName] !== 'undefined') ? messageCounter[UserName].edited : 0,
            "deleted": (typeof messageCounter[UserName] !== 'undefined') ? messageCounter[UserName].deleted : 0
        };
        switch (ActionType) {
            case "create":
                messageCounter[UserName].posted++;
                break;
            case "edit":
                messageCounter[UserName].edited++;
                break;
            case "delete":
                messageCounter[UserName].deleted++;
                break;
        }
        basic.JSON_edit(statisticsPath, UserName, { "posted": messageCounter[UserName].posted, "edited": messageCounter[UserName].edited, "deleted": messageCounter[UserName].deleted });
    }).catch(error => log.error(error));
};
