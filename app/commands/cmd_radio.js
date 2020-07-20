const log = require('../logger.js');

module.exports = {
	name: 'radio',
	description: 'radio',
	execute(data, args) {
		message.channel.send('beep.');
	},
};