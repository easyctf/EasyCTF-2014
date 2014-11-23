var flag = "b0ole4n_l0g1c_011000100110100101101110011000010111001001111001";

exports.get_data = function(req, callback) {
	var result = [];
	for (var i = 0; i < 30; i++){
	var a = Math.floor(Math.random()*50);
	var b = Math.floor(Math.random()*50);
	result.push([a,b]);
	}
	req.session.data = result;
	callback(result);
};

exports.check_data = function(req, callback) {
	var data = req.session.data;
	var ans = "";
	var a = data;
	for (var i = 0; i < data.length; i++){
		if (a[i][0] + a[i][1] <= 35){
			ans += "1";
		}
		else{
			ans += "0";
		}
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

