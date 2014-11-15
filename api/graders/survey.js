exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("hellllyeah") != -1) {
		callback({
			correct: true,
			message: "Yeeeaahhhh"
		});
	} else {
		callback({
			correct: false,
			message: "I seriously recommend you finish this one before trying the others..."
		});
	}
};