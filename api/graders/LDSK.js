
exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("l1n3s_and_d0ts_t0_w0rdz") != -1) {
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