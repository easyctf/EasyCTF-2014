exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("b0ole4n_l0g1c_011000100110100101101110011000010111001001111001") != -1) {
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