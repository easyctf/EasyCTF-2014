exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("wow_the_random_module_in_python_is_pretty_easy_to_hax") != -1) {
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