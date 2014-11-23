var flag = "arrays_aren't_hard_because_python_rocks";

exports.get_data = function(req, callback) {
	var result = [];
	var arr = []
	for (var i = 0; i < 50; i++){
	arr.push(Math.floor(Math.random()*200));
	}
	result.push(arr);
	result.push(Math.floor(Math.random()*50));
	req.session.data = result;
	callback(result);
};

exports.check_data = function(req, callback) {
	var data = req.session.data;
	//var ans = 0;
	var a = data[0];
	var b = a.sort(function(a, b){return b-a});
	var ans = String(a[data[1]]);
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

