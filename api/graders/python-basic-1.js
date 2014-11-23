exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("don't_worry_it's_gonna_get_harder_for_all_you_pros") != -1) {
		callback({
			correct: true,
			message: "Nice job!"
		});
	} else {
		callback({
			correct: false,
			message: "Hm... try again."
		});
	}
};