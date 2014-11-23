var flag = "did_you_use_python's_[::-1]_notation?";
exports.get_data = function(req, callback) {
	var result = [];
	var s = [
		"[Go, droop aloof] sides reversed, is [fool a poor dog]. I did roar again, Niagara! ... or did I?",
		"Help Max, Enid -- in example, H. See, slave, I demonstrate yet arts no medieval sees.",
		"Egad, a base tone denotes a bad age. So may Obadiah, even in Nineveh, aid a boy, Amos. Naomi, did I moan?",
		"Sir, I soon saw Bob was no Osiris. Poor Dan is in a droop.",
		"Straw? No, too stupid a fad. I put soot on warts.",
		"Live on, Time; emit no evil.",
		"No, it is opposition.",
		"Peel's lager on red rum did murder no regal sleep.",
		"Too far away, no mere clay or royal ceremony, a war afoot."
	];
	var rand = s[(Math.random()*s.length)|0];
	var a = s[(Math.random()*s.length)|0];
	
	while (a == rand){
		a = s[(Math.random()*s.length)|0];
		}
	a += " " + rand;
	//console.log(s,a);
	result.push(a);
	
	req.session.data = result;

	callback(result);
};

exports.check_data = function(req, callback) {
	var answer = req.param("answer");
	var data = req.session.data;
	
	var s = data[0];

	var longest = "";
	var longestOrig = "";
	for(var i = s.length - 1; i >= 0; i--) {
		for (var j = i + 1; j < s.length; j++) {
			var q = s.substring(i, j);
			var t = q;
			if (q.substring(0,1).match(/[0-9a-zA-Z]+$/)){
			t = q.replace(/[^A-Za-z]/gi,'').toLowerCase();
			}
			if (t == t.split("").reverse().join("") && t.length > longest.length) {
				longest = t;
				longestOrig = q.trim();
			}
		}
	}
	var correct = longestOrig;
	/*console.log("!"+longestOrig+"!");
	console.log("!"+output+"!");
	console.log(longestOrig == output);*/
	// return longestOrig === answer;
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
