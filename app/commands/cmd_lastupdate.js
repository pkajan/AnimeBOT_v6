/*global i18n*/
const log = require('../logger.js');
const discord = require('../functions_discord');

module.exports = {
	name: 'lastupd',
	altnames: i18n.__({ phrase: "__alt_cmd__lastupd", locale: "custom" }),
	description: 'Show 5 latest commits',

	execute(data) {
		require('child_process').exec('git status -u no', function (err, stdout) { //chceck if your branch is ahead of you
			var gitInfo = "";
			var regex = new RegExp('branch is behind*');
			if (regex.test(stdout.toString())) {
				gitInfo += `\`\`\`fix\n${i18n.__("cmd_lastupd_ahead")}\`\`\``;
			}

			require('child_process').exec('git log --pretty=format:"%h" -n 1', function (err, stdout) { //get your current build
				gitInfo += `\`\`\`fix\n${i18n.__("cmd_lastupd_current", stdout.toString())}\`\`\``;
			});

			require('child_process').exec('git log -5 --oneline --all', function (err, stdout) { //get list of commits
				discord.replyMSG(data.message, gitInfo + `\n\`\`\`cs\n${stdout.toString()}\`\`\``);
				log.info(i18n.__("cmd_lastupd_log", stdout.toString()));
			});
		});
	},
};
