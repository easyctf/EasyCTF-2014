require("./math.js");

exports.data = function() {
	var result = [];

	result.push(Math.random()*40|0 + 160);
	result.push(Math.random()*40|0 + 160);

	return result;
};

exports.check = function(output, data) {
	var primes = atkin(100000);
	var solve = function(n) {
		var s = 0;
		for(var i=0;i<n;i++) {
			s += primes[primes[i]-1];
		}
		return s;
	};
	var ans = solve(data[0]) + solve(data[1]);
	return ans == parseInt(output);
};

exports.flag = function() {
	return "n0t_pr0jekt_o1ler";
};