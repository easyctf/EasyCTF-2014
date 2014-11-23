var flag = "stupid_ints_causing_those_annoying_type_errorz";

exports.get_data = function(req, callback) {
	var result = [];

	result.push("strings can be ");
	result.push("concatenated with ");
	result.push(5);
	result.push(" other strings ");
	result.push("but not with non-strings");
	req.session.data = result;
	callback(result);
};

exports.check_data = function(req, callback) {
	var data = req.session.data;
	var ans = "";
	var a = data;
	ans = String(a[0])+String(a[1])+String(a[2])+String(a[3])+String(a[4]);
	var answer = req.param("answer");
	var correct = ans;
	if (answer) {
		answer = answer.replace(/^\s+|\s+$/g,'');
		correct = correct.replace(/^\s+|\s+$/g,'');
		if (answer.toLowerCase() === correct.toLowerCase()) {
			callback({
				status: 1,
				message: "Great job! Your flag is <code>" + flag + "</code>",
			});
			return;
		} else {
			callback({
				status: 0,
				message: "Nope, try again..."
			});
			return;
		}
	} else {
		callback({
			status: 0,
			message: "Answer cannot be empty!"
		});
		return;
	}
};

