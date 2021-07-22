/*global i18n*/
const log = require('../logger.js');
const basic = require('../functions_basic');
const path = require('path');

module.exports = {
	name: 'onlinelistdownload',
	altnames: i18n.__({ phrase: "__alt_cmd__onlinelistdownload", locale: "custom" }),
	description: 'Redownload online list (json) if set in config.',
	execute(data) {
		log.info(i18n.__("cmd_onlinelistdownload_log", data.message.author.username.toString()));
		basic.download(data.config.onlineList.url, path.normalize(path.join(data.baseAppPATH, "data", "anime.json")), true);
	},
};
