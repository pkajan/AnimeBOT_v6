const log = require('../logger.js');

module.exports = {
	name: 'beep',
	description: 'add string to dictionary',
	execute(data, args) {
		message.channel.send('beep.');
	},
};