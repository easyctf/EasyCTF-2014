var flag = "arentyougladyoudidnthavetocalculatebyhand";
var gcd = function(a, b) {
    if ( ! b) {
        return a;
    }

    return gcd(b, a % b);
};

exports.get_data = function(req, callback) {
	
	var a = Math.floor(Math.random()*1000);
	var b = Math.floor(Math.random()*1000);
	var result = [];
	while (gcd(a,b) < 50){
	a = Math.floor(Math.random()*1000);
	b = Math.floor(Math.random()*1000);
	}
	//console.log(a,b);
	result.push(a);
	result.push(b);
	req.session.data = result;
	callback(result);
};

exports.check_data = function(req, callback) {
	var data = req.session.data;
	var ans = 0;
	var a = data;
	ans = gcd(data[0],data[1]);
	//console.log(data,ans);
	var answer = req.param("answer");
	var correct = String(ans);
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

