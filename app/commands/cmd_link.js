const log = require('../logger.js');
const fetch = require('node-fetch');

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
			data.message.channel.send(i18n.__("NotURL_msg", args[0]));
			return;
		}

		if (args[0]) {
			fetch(`${args[0]}`)
				.then(res => {
					if (checkStatus(res)) {
						data.message.channel.send(i18n.__("pageExist_msg", args[0]));
						log.info(i18n.__("pageExist_log", args[0], data.message.author.username.toString()));
					}
				})
				.catch(err => {
					log.info(i18n.__("pageNOTExist_log", args[0], data.message.author.username.toString()));
					if (err.code != 'ENOTFOUND') log.error(i18n.__(`${err.code}`, err, data.message.author.username.toString()));
					data.message.channel.send(i18n.__("pageNOTExist_msg", args[0]));
				});
		}
	}
}
