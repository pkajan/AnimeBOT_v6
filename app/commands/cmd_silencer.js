const log = require('../logger.js');

module.exports = {
	name: 'silencer',
	description: 'Silence bots rng responses',
	execute(data, args) {
		message.channel.send('beep.');
	},
};