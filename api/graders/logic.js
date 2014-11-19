exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("simple_logic_no_haxx_involved") != -1) {
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