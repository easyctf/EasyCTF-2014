exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("thats_so_nice") != -1) {
		callback({
			correct: true,
			message: "Wow! You're well on your way to solving some of the harder binary problems."
		});
	} else {
		callback({
			correct: false,
			message: "Nope... that's not it!"
		});
	}
};