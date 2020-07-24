const log = require('../logger.js');

module.exports = {
	name: 'info',
	altnames: i18n.__("__alt_cmd__info"),
	description: 'post list of things',
	execute(data, args) {
		message.channel.send('beep.');
	},
};