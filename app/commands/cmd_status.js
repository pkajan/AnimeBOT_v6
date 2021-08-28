/*global i18n*/
const log = require('../logger.js');
const fcb = require('../functions_basic.js');
const config_path = './config/config.json';

module.exports = {
    name: 'status',
    altnames: i18n.__({ phrase: "__alt_cmd__status", locale: "custom" }),
    description: 'change status',
    execute(data, args) {
        var types = ['WATCHING', 'PLAYING', 'LISTENING'];
        var status_type = (args[0] || "").toUpperCase();

        if (types.includes(status_type)) {
            args.splice(0, 1);
            var status_name = args.join(" ");

            try {
                data.client.user.setPresence({ activities: [{ type: status_type, name: status_name }] });
            } catch (error) {
                log.error(error);
            }
            log.info(i18n.__("cmd_status_log", data.message.author.username.toString(), status_type, status_name))

            //save changed status to settings
            fcb.JSON_edit(config_path, "activityName", status_name);
            fcb.JSON_edit(config_path, "activityType", status_type);
        }
    },
};
