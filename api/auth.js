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

			if (validatePassword(password, pwHash)) {
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

var generateSalt = function() {
	var set = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
	var salt = "";
	for(var i=0; i<16; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
};

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
};

var saltAndHash = function(pass, callback) {
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
};