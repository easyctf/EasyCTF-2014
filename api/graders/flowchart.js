exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("0240240240123407325") != -1) {
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