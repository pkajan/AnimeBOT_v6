const log = require('../logger.js');

module.exports = {
	name: 'google',
	description: 'send google link into chat',
	execute(data, args) {

		const search_string = args.join("+");
		data.message.channel.send(i18n.__("cmd_google_msg", "https://www.google.com/search?q=" + search_string));
		log.info(i18n.__("cmd_google_msg_log", data.message.author.username.toString(), search_string));
	},
};