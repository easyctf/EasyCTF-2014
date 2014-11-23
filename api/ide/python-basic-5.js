var flag = "its_string_slicing_not_pi(e)_slicing";

exports.get_data = function(req, callback) {
	var result = [];
	var a = ["though","essay","earth","really","spin","light","turn","psychology","track","into","gs"];
	var b = ["spill","list","tulip","psycho","trust","integer","gs"];
	var c = ["slip", "icicle", "etomology", "horse", "seashell", "sting", "ride", "ng", "s."]
	var r = Math.floor(Math.random()*3);
	if (r == 0)
	result.push(a);
	else if (r == 1)
	result.push(b);
	else
	result.push(c);
	req.session.data = result;
	callback(result);
};

exports.check_data = function(req, callback) {
	var data = req.session.data;
	var ans = "";
	var a = data;
	for (var i = 0; i < a[0].length; i++){
		ans += a[0][i].substr(0,2);
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

