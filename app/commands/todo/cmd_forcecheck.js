const log = require('../logger.js');

module.exports = {
	name: 'forcecheck',
	altnames: i18n.__("__alt_cmd__forcecheck"),
	description: 'forcecheck today entries for existance',
	execute(data, args) {
		message.channel.send('beep.');
	},
};