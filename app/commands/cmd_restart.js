/*global i18n*/
const log = require('../logger.js');
const basic = require('../functions_basic');

module.exports = {
	name: 'restart',
	altnames: i18n.__({ phrase: "__alt_cmd__restart", locale: "custom" }),
	description: 'Restart app.',
	execute(data) {
		log.info(i18n.__("cmd_restart_log", data.message.author.username.toString()));
		basic.resetNodemon();
	},
};
