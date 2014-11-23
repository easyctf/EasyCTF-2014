exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("beginner_math_loops_5_e_z_3_me") != -1) {
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