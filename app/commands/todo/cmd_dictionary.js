const log = require('../logger.js');

module.exports = {
	name: 'dictionary',
	altnames: `${i18n.__("__alt_cmd__dictionary")}`,
	description: 'add string to dictionary',
	execute(data, args) {
		//message.channel.send('beep.');
		console.log(this.name);
	},
};
