const log = require('../logger.js');
const fetch = require('node-fetch');
const discord = require('../functions_discord');

function checkStatus(res) {
	if (res.status >= 200 & res.status < 300) { // res.status >= 200 && res.status < 300
		return true;
	} else {
		return res.statusText;
	}
}

module.exports = {
	name: 'link',
	altnames: i18n.__("__alt_cmd__link"),
	description: 'test link existance on internet',
	execute(data, args) {
		if (!args[0].includes("http") & !args[0].includes("ftp")) {
			log.info(i18n.__("NotURL_log", args[0], data.message.author.username.toString()));
			discord.replyMSG(data.message, i18n.__("NotURL_msg", args[0]));
			return;
		}

		if (args[0]) {
			fetch(`${args[0]}`)
				.then(res => {
					if (checkStatus(res)) {
						discord.replyMSG(data.message, i18n.__("pageExist_msg", args[0]));
						log.info(i18n.__("pageExist_log", args[0], data.message.author.username.toString()));
					}
				})
				.catch(err => {
					log.info(i18n.__("pageNOTExist_log", args[0], data.message.author.username.toString()));
					if (err.code != 'ENOTFOUND' && err.code != 'EAI_AGAIN') { //ENOTFOUND = not found | EAI_AGAIN = name resolution error
						log.info(i18n.__("pageNOTExist_err_log", err.message));
						log.info(i18n.__("pageNOTExist_err_log", data.message.author.username.toString()));
						log.info(i18n.__("pageNOTExist_err_log", err.code));
					}
					discord.replyMSG(data.message, i18n.__("pageNOTExist_msg", args[0]));
				});
		}
	}
}
