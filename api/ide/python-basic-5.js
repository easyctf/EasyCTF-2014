var flag = "string_slicing_not_pi_slicing";

exports.get_data = function(req, callback) {
	var result = ["though","essay","earth","really","spin","light","turn","psychology","track","into","gs"];
	req.session.data = result;
	callback(result);
};

exports.check_data = function(req, callback) {
	var data = req.session.data;
	var ans = "";
	var a = data;
	for (var i = 0; i < a.length; i++){
		ans += a[i].substr(0,2);
	}
	//console.log(data,ans);
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

