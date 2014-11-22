exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("see_linux_isn't_so_scary_after_all") != -1) {
		callback({
			correct: true,
			message: "Great! You're really getting the hang of this!"
		});
	} else {
		callback({
			correct: false,
			message: "Nope. Try again! You shouldn't have to guess on these problems."
		});
	}
};