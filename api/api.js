var account = require("./account");
var auth = require("./auth");
var scoreboard = require("./scoreboard");
var group = require("./group");

module.exports = function(app) {
	app.get("/api", function(req, res) {
		res.send({
			message: "hi :D"
		});
	});

	app.post("/api/login", function(req, res) {
		auth.login(req, res);
	});

	app.get("/api/logout", function(req, res) {
		res.send(auth.logout(req));
	});

	app.get("/api/isloggedin", function(req, res) {
		res.send(auth.is_logged_in(req));
	});

	app.post("/api/register", function(req, res) {
		account.register_team(req, res);
	});

	app.get("/api/groups", function(req, res) {
		group.get_group_membership(req.session.tid, res);
	});

	app.get("/api/scoreboards", function(req, res) {
		var scoreboards = [scoreboard.get_public_scoreboard()];
		res.send(scoreboards);
	});
};