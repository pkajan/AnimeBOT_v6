const log = require('../logger.js');
const basic = require('../functions_basic');

module.exports = {
	name: 'onlinelistdownload',
	altnames: i18n.__({ phrase: "__alt_cmd__onlinelistdownload", locale: "custom" }),
	description: 'Redownload online list (json) if set in config.',
	execute(data, args) {
		log.info(i18n.__("cmd_onlinelistdownload_log", data.message.author.username.toString()));
		basic.download(data.config.onlineList.url, data.baseAppPATH + "/data/anime.json", true);
	},
};
