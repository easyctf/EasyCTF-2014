exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("ph1l_k4tz") != -1) {
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