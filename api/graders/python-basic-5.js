exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("its_string_slicing_not_pi(e)_slicing") != -1) {
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