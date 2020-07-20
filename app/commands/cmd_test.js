const log = require('../logger.js');

module.exports = {
	name: 'test',
	description: 'only test',
	execute(data, args) {
		message.channel.send('beep.');
		log.info(i18n.__("cmd_test_log", data.message.author.username.toString()));
	},
};