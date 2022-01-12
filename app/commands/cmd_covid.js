/*global i18n*/
const log = require('../logger.js');
const discord = require('../functions_discord');
const basic = require('../functions_basic.js');
const path = require('path');
const { covid_data_csv } = require('../../config/config.json');	//covid data file in csv
//Datum		Pocet.potvrdenych.PCR.testami	Dennych.PCR.testov	Dennych.PCR.prirastkov	Pocet.umrti	AgTests	AgPosit)
//(date		PCR_posit_all	PCR_tests	PCR_posit_daily_add		deaths		Ag_test		Ag_posit)

module.exports = {
	name: 'covid',
	altnames: i18n.__({ phrase: "__alt_cmd__covid", locale: "custom" }),
	description: 'post covid info',
	execute(data) {
		function optimizeString(str) {
			return str.replace(/\r?\n|\r/g, "");
		}
		function testEmpty(str) {
			if (str == "undefined" || str == "NA") return null;
			return str;
		}
		var csvfile = path.normalize(path.join(data.baseAppPATH, "data", "data.csv"));
		basic.download(covid_data_csv, csvfile);

		setTimeout(function () {
			var datacsv = basic.readSYNC(csvfile);
			datacsv = datacsv.split('\n');
			var tmp = [];
			datacsv.forEach(val => tmp.push(val.split(';')));

			var COVIDmessage = "**COVID STATS**\n" +
				optimizeString("**DATE**: " + tmp[tmp.length - 3][0] + " => " + tmp[tmp.length - 2][0]) + "\n" +
				((testEmpty(tmp[tmp.length - 2][2])) ? optimizeString("**POZIT PCR+**: **" + tmp[tmp.length - 2][3] + "** / " + tmp[tmp.length - 2][2]) + "\n" : "") +
				((testEmpty(tmp[tmp.length - 2][5])) ? optimizeString("**POZIT Ag+**: **" + tmp[tmp.length - 2][6] + "** / " + tmp[tmp.length - 2][5]) + "\n" : "") +
				((testEmpty(tmp[tmp.length - 2][4])) ? optimizeString("**DEATH+**: **" + (tmp[tmp.length - 2][4] - tmp[tmp.length - 3][4]) + "** `[" + tmp[tmp.length - 3][4] + " => " + tmp[tmp.length - 2][4] + "]`") : "");
			discord.replyMSG(data.message, COVIDmessage);
			log.info(i18n.__("cmd_covid_log", data.message.author.username.toString()));
		}, 5000);

	},
};
