exports.grade = function(team, key, callback) {
	if (typeof key === "string" && parseInt(key) == 7092) {
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