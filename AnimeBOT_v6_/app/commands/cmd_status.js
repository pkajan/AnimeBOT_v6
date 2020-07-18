module.exports = {
	name: 'status',
	description: 'change status',
	execute(data, args) {

		var status_type = args[0].toUpperCase();
		args.splice(0, 1);
		var status_name = args.join(" ");

		console.log(args);
		data.client.user.setPresence({ activity: { name: status_name, type: status_type } })
			.then(console.log)
			.catch(console.error);
	},
};