exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("kids_dont_code_like_this_at_home") != -1) {
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