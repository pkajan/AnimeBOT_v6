const log = require('../logger.js');
const fs = require('fs-extra');

module.exports = {
	name: 'restart',
	altnames: i18n.__("__alt_cmd__restart"),
	description: 'Restart app.',
	execute(data, args) {
        log.info(i18n.__("cmd_restart_log", data.message.author.username.toString()));
		fs.writeFile(data.baseAppPATH + "\\data\\_.RESET", '', function (err) {
			if (err) return log.error(err);
		});
	},
};
