exports.grade = function(team, key, callback) {
	var flag = "CAESAR_IS_HOME";
	if (typeof key === "string" && key.toLowerCase().indexOf(flag.toLowerCase()) != -1) {
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