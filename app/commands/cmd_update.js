const log = require('../logger.js');


module.exports = {
	name: 'update',
	description: 'Run command to update bot from internet!',
	execute(data) {
		console.log(data.baseAppPATH);
	}
};