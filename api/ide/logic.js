var flag = "simple_logic_no_haxx_involved";

exports.get_data = function(req, callback) {
	var result = [];

	result.push(Math.random()*250 - 100);
	//console.log(result);
	req.session.data = result;
	callback(result);
};

exports.check_data = function(req, callback) {
	var data = req.session.data;
	var ans = "";

	var a = data[0];
	if (a < 0){
		ans = "hakz"
	}
	else if (a >= 0 && a < 100){
		ans = "hacks"
	}
	else {
		ans = "haxx"
	}

	//return ans == parseInt(output);
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

