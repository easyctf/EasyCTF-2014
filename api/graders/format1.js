exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("it's over 9000!!11!1one1!".toLowerCase()) != -1) {
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