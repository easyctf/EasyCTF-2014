exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("osu_is_love_osu_is_l1fe") != -1) {
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