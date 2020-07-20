const log = require('../logger.js');
const fcb = require('../functions_basic.js');

const config = require('../../config/config.json');

module.exports = {
	name: 'status',
	description: 'change status',
	execute(data, args) {
		var types = Array("WATCHING", "PLAYING", "LISTENING");
		var status_type = (args[0] || "").toUpperCase();

		if (types.includes(status_type)) {
			args.splice(0, 1);
			var status_name = args.join(" ");

			data.client.user.setPresence({ activity: { name: status_name, type: status_type } })
				.then(log.info(i18n.__("cmd_status_log", data.message.author.username.toString(), status_type, status_name)))
				.catch(e => log.error(e));

				fcb.JSON_file_add_edit_element(config, "activityType", status_name);
		}
	},
};