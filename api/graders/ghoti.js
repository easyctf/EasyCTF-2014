exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("bl0w_fish_so_s3cret") != -1) {
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