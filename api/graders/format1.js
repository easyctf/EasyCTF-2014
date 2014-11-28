exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("this_is_an_uncreative_flag".toLowerCase()) != -1) {
		callback({
			correct: true,
			message: "Awesome!"
		});
	} else {
		callback({
			correct: false,
			message: "Nope, try again."
		});
	}
};