var common = require("./common");

var debug_disable_general_login = false;

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
	var teamCurr = common.db.accounts.find({
		username: teamname
	});
	
	if (teamCurr.count() == 0) {
		return {
			success: 0,
			message: "Team " + teamname + " not found."
		}
	}
	if (teamCurr.count() > 1) {
		// wtf
		return {
			success: 0,
			message: "An error occurred while trying to retrieve your account information."
		}
	}

	var checkTeam = teamCurr[0];
	var pwHash = checkTeam.password;

	if (validatePassword(password, pwHash)) {
		if (debug_disable_general_login) {

		}
		if (checkTeam.tid) {
			req.session.tid = checkTeam.tid;
		} else {
			req.session.tid = checkTeam._id.toString();
			common.db.update({
				_id: checkTeam._id
			}, {
				$set: {
					tid: checkTeam._id.toString()
				}
			});
		}
		return {
			success: 1,
			message: "Logged in as " + teamname
		}
	}
	return {
		success: 0,
		message: "Incorrect password."
	}
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

var validatePassword = function(plain, hashed) {
	var salt = hashed.substr(0, 16);
	var valid = salt + md5(plain + salt);
	return hashed === valid;
};