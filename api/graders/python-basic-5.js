exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("string_slicing_not_pi_slicing") != -1) {
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