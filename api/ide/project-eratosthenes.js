var flag = "n0t_pr0jekt_o1ler_but_s1mil4r";
var math = require("./math.js");

exports.get_data = function(req, callback) {
	var result = [];

	result.push(Math.random()*40|0 + 160);
	result.push(Math.random()*40|0 + 160);

	req.session.data = result;
	callback(result);
};

exports.check_data = function(req, callback) {
	var data = req.session.data;
	var primes = math.atkin(100000);
	// console.dir(primes);
	var solve = function(n) {
		var s = 0;
		for(var i=0;i<n;i++) {
			s += primes[primes[i]-1];
		}
		return s;
	};
	var ans = solve(data[0]) + solve(data[1]);

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

