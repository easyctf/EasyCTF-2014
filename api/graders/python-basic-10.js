exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("x0r_encrypti0n_is_be_e4sy_t0_crack") != -1) {
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