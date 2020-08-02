const date = require('date-and-time');
require('date-and-time/plugin/ordinal');
date.plugin('ordinal');
const log = require('../logger.js');
const animes = require('../../data/anime.json');
const basic = require('../functions_basic.js');
const discord = require('../functions_discord');
const calc = require('../functions_calculators.js');

var OrderedList = { "today": {}, "tomorrow": {}, "twoDays": {}, "three_to_sevenDays": {}, "later": {} };

module.exports = {
	name: 'onlinelist',
	altnames: i18n.__({ phrase: "__alt_cmd__onlinelist", locale: "custom" }),
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
				case (dayDiff == 1): //tomorrow
					//code
					OrderedList.tomorrow[name] = tmpDATA;
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

		var combined = [OrderedList.today, OrderedList.tomorrow, OrderedList.twoDays, OrderedList.three_to_sevenDays];
		var titles = [i18n.__("today"), i18n.__("tomorrow"), i18n.__("two_days"), i18n.__("less_than_week")];
		combined.forEach(part => {
			if (!basic.isEmpty(part)) {
				ListMessage += "```fix\n" + titles[0] + ":```\n";
				titles.shift();
				for (var entry in part) {
					var obj = part[entry];
					ListMessage += EntryString(obj);
				}
				ListMessage += "\n";
			} else {
				titles.shift();
			}
		});

		if (!basic.isEmpty(OrderedList.later) && data.config.show_more_than_week) {
			ListMessage += "```fix\n" + i18n.__("later") + ":```\n";
			for (var entry in OrderedList.later) {
				var obj = OrderedList.later[entry];
				ListMessage += EntryString(obj);
			}
			ListMessage += "\n";
		}
		discord.replyMSG(data.message, ListMessage);
		log.info(i18n.__("cmd_onlinelist_msg_log", data.message.author.username.toString()));
	},
};
