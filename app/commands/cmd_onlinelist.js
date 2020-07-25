const date = require('date-and-time');
require('date-and-time/plugin/ordinal');
date.plugin('ordinal');
const log = require('../logger.js');
const animes = require('../../data/anime.json');
const basic = require('../functions_basic.js');
const calc = require('../function_calculators.js');

var OrderedList = { "today": {}, "tomorow": {}, "twoDays": {}, "three_to_sevenDays": {}, "later": {} };

module.exports = {
	name: 'onlinelist',
	altnames: i18n.__("__alt_cmd__onlinelist"),
	description: 'manualy initiate anime list update',
	execute(data, args) {
		for (var i in animes) {
			var entryDate = date.parse(`${animes[`${i}`].year}-${calc.fixDubleDigits(animes[`${i}`].month)}-${calc.fixDubleDigits(animes[`${i}`].day)}`, 'YYYY-MM-DD');
			var newData = calc.NewRelease(entryDate, 7, parseInt(animes[`${i}`]._starting_episode) - parseInt(animes[`${i}`]._skipped_episodes), animes[`${i}`]._last_episode);
			var name = i;
			var dayDiff = parseInt(newData.differenceDAYS);
			var link = basic.parse(animes[`${i}`].link, newData.startEP);
			var newDate = newData.newDate;
			var ep = newData.startEP;
			var tmpDATA = { 'name': name, 'link': link, 'ep': ep, 'newDate': newDate, 'dayDiff': dayDiff };

			//sorting
			switch (true) {
				case (dayDiff < 0): //ended
					//code
					break;
				case (dayDiff == 0): //today
					//code
					OrderedList.today[name] = tmpDATA
					break;
				case (dayDiff == 1): //tomorow
					//code
					OrderedList.tomorow[name] = tmpDATA;
					break;
				case (dayDiff == 2): //twoDays
					//code
					OrderedList.twoDays[name] = tmpDATA;
					break;
				case (dayDiff > 2 && dayDiff <= 7): //three_to_sevenDays
					//code
					OrderedList.three_to_sevenDays[name] = tmpDATA;
					break;
				default: //later
					//code
					OrderedList.later[name] = tmpDATA;
			}
		}

		var ListMessage = "";
		EntryString = (obj) => { return `**${obj.name}**: ${date.format(obj.newDate, 'dddd, DDD MMMM')} [\`ep${obj.ep}\`]\n`; };

		if (!basic.isEmpty(OrderedList.today)) {
			ListMessage += "```fix\nToday:```\n";
			for (var entry in OrderedList.today) {
				var obj = OrderedList.today[entry];
				ListMessage += EntryString(obj);
			}
			ListMessage += "\n";
		}
		if (!basic.isEmpty(OrderedList.tomorow)) {
			ListMessage += "```fix\nOne Day:```\n";
			for (var entry in OrderedList.tomorow) {
				var obj = OrderedList.tomorow[entry];
				ListMessage += EntryString(obj);
			}
			ListMessage += "\n";
		}
		if (!basic.isEmpty(OrderedList.twoDays)) {
			ListMessage += "```fix\nTwo Days:```\n";
			for (var entry in OrderedList.twoDays) {
				var obj = OrderedList.twoDays[entry];
				ListMessage += EntryString(obj);
			}
			ListMessage += "\n";
		}
		if (!basic.isEmpty(OrderedList.three_to_sevenDays)) {
			ListMessage += "```fix\nLess than week:```\n";
			for (var entry in OrderedList.three_to_sevenDays) {
				var obj = OrderedList.three_to_sevenDays[entry];
				ListMessage += EntryString(obj);
			}
			ListMessage += "\n";
		}
		if (!basic.isEmpty(OrderedList.later)) {
			ListMessage += "```fix\nLater:```\n";
			for (var entry in OrderedList.later) {
				var obj = OrderedList.later[entry];
				ListMessage += EntryString(obj);
			}
			ListMessage += "\n";
		}
		data.message.channel.send(ListMessage);
		log.info(i18n.__("cmd_onlinelist_msg_log", data.message.author.username.toString()));

	},
};