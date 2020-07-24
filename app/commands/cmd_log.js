const log = require('../logger.js');

module.exports = {
	name: 'log',
	altnames: i18n.__("__alt_cmd__log"),
	description: 'upload bot log into current channel',
	execute(data, args) {
		message.channel.send('beep.');
	},
};