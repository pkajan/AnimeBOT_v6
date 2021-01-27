const log = require('../logger.js');
const discord = require('../functions_discord');
const { selfDestructTime } = require('../../config/config.json');

module.exports = {
	name: 'help',
	altnames: i18n.__({ phrase: "__alt_cmd__help", locale: "custom" }),
	description: 'send all available commands into chat',
	execute(data, args) {
		var outputString = "";
		var totok = Object.values(data.commandList);
		Object.keys(data.commandList).forEach(value => {
			outputString += `\`${value}\` : ${data.commandList[value]}\n`;
		});

		discord.selfDestructReply(data.message, i18n.__("cmd_help_msg", outputString.replace(/__alt_cmd__/g, "").replace(/;/g, ", ")), null, selfDestructTime);
		log.info(i18n.__("cmd_help_msg_log", data.message.author.username.toString()));
	},
};
