const log = require('../logger.js');

module.exports = {
	name: 'info',
	description: 'post list of things',
	execute(data, args) {
		message.channel.send('beep.');
	},
};