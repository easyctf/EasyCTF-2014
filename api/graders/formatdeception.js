exports.grade = function(team, key, callback) {
	if (typeof key === "string" && key.toLowerCase().indexOf("d0nt_judg3_a_file_by_1ts_ext3nsi0n") != -1) {
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