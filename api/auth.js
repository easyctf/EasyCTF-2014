var common = require("./common");

exports.login = function(req) {
	if ("tid" in req.session) {
		return {
			success: 1,
			message: "You are already logged in."
		};
	}

	var teamname = req.param("teamname");
	var password = req.param("password");

	if (teamname == undefined || teamname == "") {
		return {
			success: 0,
			message: "Team name cannot be empty."
		};
	}
	if (password == undefined || password == "") {
		return {
			success: 0,
			message: "Password cannot be empty."
		};
	}
	if (teamname.length > 250) {
		return {
			success: 0,
			message: "STAHP!"
		};
	}
	teamCurr = common.db.accounts.find({
		username: teamname
	});
	console.dir(teamCurr);
};

exports.is_logged_in = function(req) {
	if ("tid" in req.session) {
		return {
			success: 1,
			message: "You appear to be logged in."
		};
	} else {
		return {
			success: 0,
			message: "You do not appear to be logged in."
		};
	}
};