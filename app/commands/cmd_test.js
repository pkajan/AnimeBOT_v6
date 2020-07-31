const log = require('../logger.js');
const basic = require('../functions_basic.js');
const discord = require('../functions_discord');

module.exports = {
	name: 'test',
	altnames: i18n.__("__alt_cmd__test"),
	description: 'only test',
	execute(data, args) {
		discord.replyMSG(data.message, 'beep.');
		log.info(i18n.__("cmd_test_log", data.message.author.username.toString()));
	},
};
