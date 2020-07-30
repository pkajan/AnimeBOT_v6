const log = require('../logger.js');
const basic = require('../functions_basic.js');

module.exports = {
	name: 'test',
	altnames: i18n.__("__alt_cmd__test"),
	description: 'only test',
	execute(data, args) {
		data.message.channel.send('beep.');
		log.info(i18n.__("cmd_test_log", data.message.author.username.toString()));
	},
};