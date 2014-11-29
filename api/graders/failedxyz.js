exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("failed_up_is_the_best_fail_you_are_ctf_champion") != -1) {
		callback({
			correct: true,
			message: "Ok now write your write-up."
		});
	} else {
		callback({
			correct: false,
			message: "Don't try to guess on this one. You won't get it that way."
		});
	}
};