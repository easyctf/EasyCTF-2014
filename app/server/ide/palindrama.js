exports.data = function() {
	var result = [];
	var s = [
		"[Go, droop aloof] sides reversed, is [fool a poor dog]. I did roar again, Niagara! ... or did I?",
		"Help Max, Enid -- in example, H. See, slave, I demonstrate yet arts no medieval sees.",
		"Egad, a base tone denotes a bad age. So may Obadiah, even in Nineveh, aid a boy, Amos. Naomi, did I moan?",
		"Sir, I soon saw Bob was no Osiris. Poor Dan is in a droop.",
	];
	var rand = s[(Math.random()*s.length)|0];
	var a = s[(Math.random()*s.length)|0];
	
	while (a == rand){
		a = s[(Math.random()*s.length)|0];
		}
	a += " " + rand;
	//console.log(s,a);
	result.push(a);

	return result;
};

exports.check = function(output, data) {
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
	/*onsole.log("!"+longestOrig+"!");
	console.log("!"+output+"!");
	console.log(longestOrig == output);*/
	return longestOrig === output;
};

exports.flag = function() {
	return "did_you_use_[::-1]_notation";
};
