exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("p0st_is_moar_secure_than_g3t") != -1) {
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