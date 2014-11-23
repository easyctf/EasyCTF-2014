var flag = "is_this_pr0jekt_o1ler?";

exports.get_data = function(req, callback) {
	var result = [];

	result.push(Math.random()*6|0 + 5);
	result.push(Math.random()*5|0 + 11);
	result.push(Math.random()*5|0 + 16);
	result.push(Math.random()*1000|0 + 2000);

	req.session.data = result;
	callback(result);
};

exports.check_data = function(req, callback) {
	var data = req.session.data;
	var ans = 0;

	var a = data[0];
	var b = data[1];
	var c = data[2];
	var l = data[3];

	for(var i=0;i<l;i++) {
		if(i%a==0 || i%b==0 || i%c==0) {
			ans += i;
		}
	}

	//return ans == parseInt(output);
	var answer = req.param("answer");
	var correct = ans.toString();
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

