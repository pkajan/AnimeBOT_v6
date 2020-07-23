const log = require('../logger.js');
const { updateCMD } = require('../../config/config.json');


module.exports = {
	name: 'update',
	description: 'update bot from internet/github repo!',
	execute(data) {
		log.info(i18n.__("updateStarted", data.message.author.username.toString()));

		var cmdUPD = [
			"git reset --hard",
			"git fetch --all",
			"git pull"
		];

		cmdUPD.forEach(element => {
			var spawn = require('child_process').spawnSync;
			var child = spawn('cmd', [`/c ${element}`]);
			log.info(child.stdout);
		});
		log.info(i18n.__("updateEnded", data.message.author.username.toString()));
	}
};
