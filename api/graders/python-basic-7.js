exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("arrays_too_easy_4_me") != -1) {
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