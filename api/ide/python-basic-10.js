var flag = "x0r_encrypti0n_can_be_easy_t0_crack";
function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}
function xorEncode(txt, pass) {
 
    var ord = []
    var buf = ""
 
    for (z = 1; z <= 255; z++) {ord[String.fromCharCode(z)] = z}
 
    for (j = z = 0; z < txt.length; z++) {
        buf += String.fromCharCode(ord[txt.substr(z, 1)] ^ ord[pass.substr(j, 1)])
        j = (j < pass.length) ? j + 1 : 0
    }
 
    return buf
 
}
exports.get_data = function(req, callback) {
	var result = [];
	var a = "0000000000000000000000001c1b1c1c524f010c041b0b154c4f071c171b4e1454150018020f41150e41180e14"; //cipher 1
	var b = "7468697320697320746865206f6e6c79206f726967696e616c20737472696e6720676976656e20746f20796f75"; //original 1
	var c = "1f001d4445040c1059161b1b4f1c451f16521006010b00161d1100060f0d521b155400011d4502141304";
	var d = "786f7220656e6372797074696f6e20697320636f6f6c206275742063616e20626520696e736563757265";
	e = Math.floor(Math.random()*2);
	if (e == 0){
	result.push(a);
	result.push(b);
	}
	else{
	result.push(c);
	result.push(d);
	}
	//console.log(result);
	req.session.data = result;
	callback(result);
};

exports.check_data = function(req, callback) {
	var data = req.session.data;
	var ans = "";
	var hex1 = hex2a(data[0]);
	var hex2 = hex2a(data[1]);
	ans = String(xorEncode(hex1, hex2));
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

