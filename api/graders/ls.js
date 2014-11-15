exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("look_i_am_a_flag") != -1) {
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