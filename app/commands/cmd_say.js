module.exports = {
	name: 'say',
	description: 'force bot to say your words',
	execute(data, args) {
		if (args.length > 0) {
			const sayMessage = args.join(" ");
			// And we get the bot to say the thing:
			//discord.MSGReply(message, sayMessage);
			data.message.channel.send(sayMessage);
			//things.log(things.translate("cmd_say_msg", sayMessage, message.author.username.toString()));
		} else {
			data.message.channel.send(i18n.__("cmd_say_empty", data.prefix));
			//things.log(things.translate("cmd_say_msg_log", message.author.username.toString()));
		}
	},
};