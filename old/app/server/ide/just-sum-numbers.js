exports.data = function() {
	var result = [];

	result.push(Math.random()*6|0 + 5);
	result.push(Math.random()*5|0 + 11);
	result.push(Math.random()*5|0 + 16);
	result.push(Math.random()*1000|0 + 2000);

	return result;
};

exports.check = function(output, data) {
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

	return ans == parseInt(output);
};

exports.flag = function() {
	return "pr0jekt_o1ler";
};