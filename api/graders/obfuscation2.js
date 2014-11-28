exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.indexOf("0bfuscaTion fTw") != -1) {
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
