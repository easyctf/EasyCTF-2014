exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("n0t_pr0jekt_o1ler_but_s1mil4r") != -1) {
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