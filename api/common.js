var MongoDB = require("mongodb").Db;
var Server = require("mongodb").Server;

exports.db = new MongoDB("app29067833", new Server("kahana.mongohq.com", 10071, { auto_reconnect: true }), {w: 1});

exports.db.open(function(err, db) {
	if (err) {
		console.dir(err);
	} else {
		console.log("[api/common.js] connected to mongo db");
		db.authenticate("github_user", "__temporarypassword__", function(err, res) {
			if (err) {
				console.dir(err);
			} else {
				console.log("[api/common.js] authenticated to mongo db");
			}
		});
	}
});

exports.esc = function(s) {
	return s.replace("&", "&amp;")
		.replace("<", "&lt;")
		.replace(">", "&gt;")
		.replace('"', "&quot;")
		.replace("'", "&#39;");
};

exports.token = function() {
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	var token = "";
	for(var i=0; i<25; i++) {
		var R = Math.floor(Math.random()*chars.length);
		token += chars.substring(R, R+1);
	}
	return token;
};

exports.sec_token = function() {
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	var token = "";
	for(var i=0; i<25; i++) {
		var R = Math.floor(Math.random()*chars.length);
		token += chars.substring(R, R+1);
	}
	return token;
};