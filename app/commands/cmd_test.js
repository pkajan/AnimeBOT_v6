/*global i18n*/
const log = require('../logger.js');
const basic = require('../functions_basic.js');
const discord = require('../functions_discord');

module.exports = {
	name: 'test',
	altnames: i18n.__({ phrase: "__alt_cmd__test", locale: "custom" }),
	description: 'only test',
	execute(data, args) {
		discord.replyMSG(data.message, basic.deunicode('beep.') + args);
		log.info(i18n.__("cmd_test_log", data.message.author.username.toString()));
	},
};
