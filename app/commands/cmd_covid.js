/*global i18n*/
const log = require('../logger.js');
const discord = require('../functions_discord');
const basic = require('../functions_basic.js');
const path = require('path');

module.exports = {
	name: 'covid',
	altnames: i18n.__({ phrase: "__alt_cmd__covid", locale: "custom" }),
	description: 'post covid info',
	execute(data) {
		var csvurl = "https://mapa.covid.chat/export/csv";
		var csvfile = path.normalize(path.join(data.baseAppPATH, "data", "data.csv"));
		basic.download(csvurl, csvfile);

		setTimeout(function () {
			var datacsv = basic.readSYNC(csvfile);
			datacsv = datacsv.split('\n');
			var tmp = [];
			datacsv.forEach(val => tmp.push(val.split(';')));

			var COVIDmessage = "**COVID STATS**\n" +
				"**DATE**: " + tmp[tmp.length - 3][0] + " => " + tmp[tmp.length - 2][0] + "\n" +
				"**POZIT+**: **" +  tmp[tmp.length - 2][3] + "**\n" +
				"**DEATH+**: **" + (tmp[tmp.length - 2][4] - tmp[tmp.length - 3][4]) + "** `[" + tmp[tmp.length - 3][4] + " => " + tmp[tmp.length - 2][4] + "]`";
			discord.replyMSG(data.message, COVIDmessage);
			log.info(i18n.__("cmd_covid_log", data.message.author.username.toString()));
		}, 5000);

	},
};
