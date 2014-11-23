exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("combine_all_y0ur_kn0wledge") != -1) {
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