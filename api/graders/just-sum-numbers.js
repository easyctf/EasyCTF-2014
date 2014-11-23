exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("is_this_pr0jekt_o1ler?") != -1) {
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