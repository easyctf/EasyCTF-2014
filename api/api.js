var account = require("./account");
var auth = require("./auth");
var scoreboard = require("./scoreboard");
var group = require("./group");
var problem = require("./problem");

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

	app.get("/api/problems", function(req, res) {
		problem.load_unlocked_problems(req.session.tid, function(unlocked) {
			res.send(unlocked);
		});
	});

	app.get("/api/problems/solved", function(req, res) {
		problem.get_solved_problems(req.session.tid, res);
	});

	app.get("/api/problems/:pid", function(req, res) {
		problem.get_single_problem(req.params.pid, req.session.tid, function(problem_info) {
			if (!('status' in problem_info)) {
				problem_info['status'] = 1;
			}
			res.send(problem_info);
		});
	});

	app.get("/api/groups", function(req, res) {
		group.get_group_membership(req.session.tid, res);
	});

	app.get("/api/scoreboards", function(req, res) {
		var scoreboards = [scoreboard.get_public_scoreboard()];
		res.send(scoreboards);
	});

	app.post("/api/submit", function(req, res) {
		problem.submit_problem(req.session.tid, req, function(result) {
			res.send(result);
		});
	});
};