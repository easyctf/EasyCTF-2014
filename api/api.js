var account = require("./account");
var auth = require("./auth");
var scoreboard = require("./scoreboard");
var group = require("./group");
var problem = require("./problem");
var forgot = require("./forgot");
var feedback = require("./feedback");

var problems = [
	"python-basic-1",
	"palindrama",
	"just-sum-numbers",
	"python-basic-2",
	"python-basic-3",
	"python-basic-4",
	"python-basic-5",
	"python-basic-6",
	"python-basic-7",
	"python-basic-8",
	"project-eratosthenes",
	"python-basic-9",
	"python-basic-10"
];

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

	app.get("/api/isadmin", function(req, res) {
		res.send(auth.is_admin(req));
	});

	app.post("/api/register", function(req, res) {
		account.register_team(req, res);
	});

	app.post("/api/feedback", function(req, res) {
		feedback.upload_feedback(req, res);
	});

	app.post("/api/ide/data", function(req, res) {
		if (auth.is_logged_in(req) && auth.is_authorized(req).success === 1 && req.param("problem") && problems.indexOf(req.param("problem")) > -1) {
			require("./ide/" + req.param("problem")).get_data(req, function(data) {
				res.send(data);
			});
		} else {
			res.send({
				status: 0,
				message: "You can't view this page!"
			});
		}
	});

	app.post("/api/ide/check", function(req, res) {
		if (auth.is_logged_in(req) && auth.is_authorized(req).success === 1 && req.param("problem") && problems.indexOf(req.param("problem")) > -1) {
			require("./ide/" + req.param("problem")).check_data(req, function(data) {
				res.send(data);
			});
		} else {
			res.send({
				status: 0,
				message: "You can't view this page!"
			});
		}
	});

	app.get("/api/problems", function(req, res) {
		if (auth.is_logged_in(req) && auth.is_authorized(req).success === 1) {
			problem.load_unlocked_problems(req.session.tid, function(unlocked) {
				res.send(unlocked);
			});
		} else {
			res.send({
				status: 0,
				message: "You can't view this page!"
			});
		}
	});

	app.get("/api/problems/solved", function(req, res) {
		if (auth.is_logged_in(req)) {
			problem.get_solved_problems(req.session.tid, res);
		} else {
			res.send({
				status: 0,
				message: "You can't view this page!"
			});
		}
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

	app.get("/api/account/info", function(req, res) {
		if (auth.is_logged_in(req)) {
			account.get_user_info(req, res);
		} else {
			res.send({
				success: 0,
				message: "You're not logged in!"
			});
			return;
		}
	});

	app.post("/api/account/update", function(req, res) {
		if (auth.is_logged_in(req)) {
			account.update_user_info(req, res);
		} else {
			res.send({
				success: 0,
				message: "You're not logged in!"
			});
			return;
		}
	});

	app.post("/api/submit", function(req, res) {
		problem.submit_problem(req.session.tid, req, function(result) {
			res.send(result);
		});
	});

	app.post("/api/forgot", function(req, res) {
		forgot.send_reset_email(req, res);
	});

	app.post("/api/passreset", function(req, res) {
		forgot.verify_code(req, res);
	});
};
