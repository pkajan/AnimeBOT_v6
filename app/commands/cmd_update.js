const log = require('../logger.js');
const { updateCMD } = require('../../config/config.json');


module.exports = {
	name: 'update',
	description: 'update bot from internet/github repo!',
	execute(data) {
		log.info(i18n.__("updateStarted", data.message.author.username.toString()));
		var execSync = require('child_process').execSync;
		var cmd = `${updateCMD}`;

		var options = {
			encoding: 'utf8'
		};
		console.log(execSync(`${cmd}`, options));
		log.info(i18n.__("updateEnded", data.message.author.username.toString()));
	}
};
