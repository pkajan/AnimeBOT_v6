const log = require('../logger.js');

module.exports = {
	name: 'onlinelist',
	description: 'manualy initiate anime list update',
	execute(data, args) {
		message.channel.send('beep.');
	},
};