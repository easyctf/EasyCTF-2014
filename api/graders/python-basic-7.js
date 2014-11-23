exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("arrays_aren't_hard_because_python_rocks") != -1) {
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