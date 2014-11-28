exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("congratz_u_just_beat_the_jung!!1!".toLowerCase()) != -1) {
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