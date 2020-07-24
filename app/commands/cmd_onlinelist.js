const date = require('date-and-time');
require('date-and-time/plugin/ordinal');
date.plugin('ordinal');
const log = require('../logger.js');
const animes = require('../../data/anime.json');

function fixDubleDigits(number) {
	if (parseInt(number) < 10) {
		return `0${parseInt(number)}`;
	} else {
		return number;
	}
}

function addDays(timeobj, number) {
	return date.addDays(timeobj, number);
}

var today = {};
var tomorrow = {};
var twoDays = {};
var three_to_sevenDays = {};
var later = {};

module.exports = {
	name: 'onlinelist',
	altnames: i18n.__("__alt_cmd__onlinelist"),
	description: 'manualy initiate anime list update',
	execute(data, args) {
		var now = date.parse(date.format(new Date(), 'YYYY-MM-DD'), 'YYYY-MM-DD'); //current date

		for (var i in animes) {
			console.log("name: " + i);
			console.log("year: " + animes[`${i}`].year);
			console.log("month: " + animes[`${i}`].month);
			console.log("day: " + animes[`${i}`].day);
			console.log("start ep: " + animes[`${i}`]._starting_episode);
			console.log("skip ep: " + animes[`${i}`]._skipped_episodes);
			console.log("last ep: " + animes[`${i}`]._last_episode);
			console.log("-----------");
		}
		
		//var moj = date.addDays(date.parse('2020-07-24', 'YYYY-MM-DD'), 7);
		//console.log("rozdiel dni: " + Math.ceil(date.subtract(moj, now).toDays()));
		/*for (var i in animes) {
			console.log(animes[`${i}`].link);
		}*/



	},
};