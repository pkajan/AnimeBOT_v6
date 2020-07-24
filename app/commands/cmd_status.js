const log = require('../logger.js');
const fcb = require('../functions_basic.js');

const config_path = './config/config.json';


module.exports = {
	name: 'status',
	altnames: i18n.__("__alt_cmd__status"),
	description: 'change status',
	execute(data, args) {
		var types = Array("WATCHING", "PLAYING", "LISTENING");
		var status_type = (args[0] || "").toUpperCase();

		if (types.includes(status_type)) {
			args.splice(0, 1);
			var status_name = args.join(" ");

			data.client.user.setPresence({ activity: { type: status_type, name: status_name } })
				.then(log.info(i18n.__("cmd_status_log", data.message.author.username.toString(), status_type, status_name)))
				.catch(e => log.error(e));

			//save changed status to settings
			fcb.JSON_edit(config_path, "activityName", status_name);
			fcb.JSON_edit(config_path, "activityType", status_type);
		}
	},
};