exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("very_uncreative_flag") != -1) {
		callback({
			correct: true,
			message: "Awesome!"
		});
	} else {
		callback({
			correct: false,
			message: "This one might be a bit trickier."
		});
	}
};