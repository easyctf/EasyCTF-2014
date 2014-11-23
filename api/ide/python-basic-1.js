var flag = "don't_worry_it's_gonna_get_harder_for_all_you_pros";

exports.get_data = function(req, callback) {
	callback([
	]);
};

exports.check_data = function(req, callback) {
	var answer = req.param("answer");
	var correct = "Hello, EasyCTF!";
	if (answer) {
		answer = answer.replace(/^\s+|\s+$/g,'');
		correct = correct.replace(/^\s+|\s+$/g,'');
		// console.log(answer.toLowerCase());
		// console.log(correct.toLowerCase());
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