exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("don't_worry_it's_gonna_get_harder_real_fast") != -1) {
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