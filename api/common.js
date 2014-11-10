var MongoDB = require("mongodb").Db;
var Server = require("mongodb").Server;

exports.db = new MongoDB("app29067833", new Server("kahana.mongohq.com", 10071, { auto_reconnect: true }), {w: 1});

db.open(function(err, db) {
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