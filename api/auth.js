var common = require("./common");
var crypto = require("crypto");

var debug_disable_general_login = false;

exports.login = function(req, res) {
	if ("tid" in req.session) {
		res.send({
			success: 1,
			message: "You are already logged in."
		});
		return;
	}

	var teamname = req.param("teamname");
	var password = req.param("password");

	if (teamname == undefined || teamname == "") {
		res.send({
			success: 0,
			message: "Team name cannot be empty."
		});
		return;
	}
	if (password == undefined || password == "") {
		res.send({
			success: 0,
			message: "Password cannot be empty."
		});
		return;
	}
	if (teamname.length > 250) {
		res.send({
			success: 0,
			message: "STAHP!"
		});
		return;
	}

	var result;
	
	common.db.collection("accounts").find({
		teamname: teamname
	}, function(err, teamCurr) {
		teamCurr.toArray(function(err, currArray) {
			if (err) {
				console.dir(err);
				res.send({
					success: 0,
					message: "Something went wrong."
				});
				return;
			}
			if (currArray.length == 0) {
				res.send({
					success: 0,
					message: "Team " + teamname + " not found."
				});
				return;
			}
			if (currArray.length > 1) {
				// wtf
				res.send({
					success: 0,
					message: "An error occurred while trying to retrieve your account information."
				});
				return;
			}

			var checkTeam = currArray[0];
			var pwHash = checkTeam.pass;

			if (common.validatePassword(password, pwHash)) {
				if (debug_disable_general_login) {

				}
				if (checkTeam.tid) {
					req.session.tid = checkTeam.tid;
				} else {
					req.session.tid = checkTeam._id.toString();
					common.db.collection("accounts").update({
						_id: checkTeam._id
					}, {
						$set: {
							tid: checkTeam._id.toString()
						}
					}, function() {

					});
				}
				res.send({
					success: 1,
					message: "Logged in as " + teamname
				});
				return;
			}
			res.send({
				success: 0,
				message: "Incorrect password."
			});
			return;
		});
	});
};

exports.logout = function(req) {
	if ("tid" in req.session) {
		req.session.destroy();
		req.session = null;
		return {
			success: 1,
			message: "Successfully logged out!"
		}
	} else {
		return {
			success: 0,
			message: "You do not appear to be logged in."
		}
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