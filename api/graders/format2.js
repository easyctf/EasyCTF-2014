exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("i_am_really_running_out_of_ideas_for_these_flags".toLowerCase()) != -1) {
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