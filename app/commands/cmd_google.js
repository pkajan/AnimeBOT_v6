/*global i18n*/
const log = require('../logger.js');
const discord = require('../functions_discord');

module.exports = {
	name: 'google',
	altnames: i18n.__({ phrase: "__alt_cmd__google", locale: "custom" }),
	description: 'send google link into chat',
	execute(data, args) {
		const search_string = args.join("+");
		discord.replyMSG(data.message, i18n.__("cmd_google_msg", "https://www.google.com/search?q=" + search_string));
		log.info(i18n.__("cmd_google_msg_log", data.message.author.username.toString(), search_string));
	},
};
