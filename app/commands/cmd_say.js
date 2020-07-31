const log = require('../logger.js');
const discord = require('../functions_discord');

module.exports = {
	name: 'say',
	altnames: i18n.__("__alt_cmd__say"),
	description: 'force bot to say your words',
	execute(data, args) {
		if (args.length > 0) {
			const sayMessage = args.join(" ");
			// And we get the bot to say the thing:
			discord.replyMSG(data.message, sayMessage);
			log.info(i18n.__("cmd_say_msg", data.message.author.username.toString(), sayMessage));
		} else {
			discord.replyMSG(data.message, i18n.__("cmd_say_empty", data.prefix));
			log.info(i18n.__("cmd_say_empty_log"));
		}
	},
};
