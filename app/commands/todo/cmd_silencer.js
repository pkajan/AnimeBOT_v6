const log = require('../logger.js');

module.exports = {
	name: 'silencer',
	altnames: i18n.__("__alt_cmd__silencer"),
	description: 'Silence bots rng responses',
	execute(data, args) {
		message.channel.send('beep.');
	},
};
