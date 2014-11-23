exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("did_you_use_python's_[::-1]_notation?") != -1) {
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