const log = require('../logger.js');
const basic = require('../functions_basic');

module.exports = {
	name: 'restart',
	altnames: i18n.__("__alt_cmd__restart"),
	description: 'Restart app.',
	execute(data, args) {
        log.info(i18n.__("cmd_restart_log", data.message.author.username.toString()));
		basic.resetNodemon();
	},
};
