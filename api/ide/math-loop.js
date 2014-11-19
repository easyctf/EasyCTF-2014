var flag = "beginner_loop_math_too_e_z";

exports.get_data = function(req, callback) {
	var result = [];

	result.push(Math.floor(Math.random()*3000000 + 1000000));
	req.session.data = result;
	callback(result);
};

exports.check_data = function(req, callback) {
	var data = req.session.data;
	var ans = 0;
	var a = data;
	for (var i = 0; i <= data[0]; i++){
		if (i%7 == 0){
			ans += i;
		}
	}
	ans = ans.toString().split("").reduce(function (i, j, key, value) { ni = Number(i); nj = Number(j); return ni + nj });
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

