const log = require('../logger.js');

module.exports = {
	name: 'uptime',
	description: 'show bot uptime',
	execute(data, args) {
		data.message.channel.send('beep.');
	},
};