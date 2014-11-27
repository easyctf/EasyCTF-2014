var common = require("./common");
var group = require("./group");
var ObjectId = require("mongodb").ObjectID;
var entities_ = require("html-entities").XmlEntities;
var entities = new entities_();

function derp(str) {
	return entities.encode(str).trim();
}

exports.register_team = function(req, res) {
	var email = req.param("email");
	var teamname = req.param("team");
	var school = req.param("school");
	var pwd = req.param("pass");
	var gname = req.param("group");
	var joingroup = req.param("joingroup");
    
    teamname = derp(teamname);
	school = derp(school);
    email = derp(email);    
    
	if (!(email && teamname && school && pwd && email.length > 0 && teamname.length > 0 && school.length > 0 && pwd.length > 0)) {
		res.send({
			status: 0,
			message: "Please fill out all of the required fields."
		});
		return;
	}

    if (!(teamname.length >= 3 && teamname <= 40)) {
		res.send({
			status: 0,
			message: "The team name must be between 3 and 40 characters."
		});
		return;
	}
    
    if (!(pwd.length >= 3 && pwd <= 20)) {
		res.send({
			status: 0,
			message: "The password must be between 3 and 20 characters."
		});
		return;
	}
    
    if (!(school.length >= 3 && school <= 100)) {
		res.send({
			status: 0,
			message: "The school name must be between 3 and 100 characters."
		});
		return;
	}
    
    /* TODO */
    //ADD EMAIL VALIDATION
    /***********************************************************/    
    /***********************************************************/    
    /***********************************************************/    
    /***********************************************************/    
    
	common.db.collection("accounts").find({
		$or: [
			{ teamname: teamname },
			{ email: email }
		]
	}).count(function(err, count) {
		if (count != 0) {
			res.send({
				status: 0,
				message: "That team name or email is already registered."
			});
			return;
		} else {
			console.log(gname);
			console.log(joingroup);
			if (gname != undefined && gname != "" && (joingroup == undefined || (joingroup != undefined && joingroup != "true"))) {
				console.log("[api/account.js] checking for existing group");
				common.db.collection("groups").find({
					name: gname
				}).count(function(err, count2) {
					if (count2 != 0) {
						console.log("[api/account.js] group exists.");
						res.send({
							status: 2,
							message: "The group name you have entered exists, would you like to join it?"
						});
						return;
					}
				});
			} else {
				console.log("[api/account.js] inserting into db");
				common.db.collection("accounts").insert({
					email: email.toString(),
					teamname: teamname.toString(),
					school: school.toString(),
					pass: common.saltAndHashSync(pwd.toString()),
					group: 1,
					pointDisplay: 0,
				}, { w: 1 }, function(err, doc) {
					console.dir(doc);
					console.log("[api/account.js] inserted.");
					var id = doc[0]._id.toString();
					if (!gname || gname == "") {
						res.send({
							status: 1,
							message: "Success! You have successfully registered."
						});
						return;
					} else {
						if (joingroup && joingroup == 'true') {
							common.db.collection("groups").find({
								name: gname
							}).count(function(err, count) {
								if (count == 0) {
									group.create_group(id, gname, res);
								} else {
									common.db.collection("groups").update({
										name: gname
									}, {
										$push: {
											members: id
										}
									}, function(err, doc) {
										res.send({
											status: 1,
											message: "Success! You have been added to the group!"
										})
									});
								}
							});
						} else {
							group.create_group(id, gname, res);
						}
					}
				});
			}
		}
	});
};

exports.get_user_info = function(req, res) {
	var _id = new ObjectId(req.session.tid);
	common.db.collection("accounts").find({
		$or: [
			{ tid: req.session.tid },
			{ _id: _id }
		]
	}).toArray(function(err, data) {
		if (err) {
			console.dir(err);
		} else {
			if (data.length === 1) {
				res.send({
					success: 1,
					name: data[0].teamname,
					email: data[0].email,
					school: data[0].school
				});
				return;
			} else {
				res.send({
					success: 0,
					message: "Couldn't find user."
				});
				return;
			}
		}
	});
};

exports.update_user_info = function(req, res) {
	var _id = new ObjectId(req.session.tid);
	var nTeamname = req.param("teamname");
	var nSchool = req.param("school");
	var nPassword = req.param("password");

	var confirm = req.param("confirm");

    nTeamname = derp(nTeamname);
	nSchool = derp(nSchool);
    
	if (!(nTeamname && nSchool && confirm)) {
		res.send({
			success: 0,
			message: "You haven't filled out the required fields."
		});
		return;
	}

	common.db.collection("accounts").find({
		$or: [
			{ tid: req.session.id },
			{ _id: _id }
		]
	}).toArray(function(err, data) {
		if (data.length == 0) {
			res.send({
				success: 0,
				message: "Couldn't find your team."
			});
			return;
		}
		if (data.length > 1) {
			res.send({
				success: 0,
				message: "wat"
			});
			return;
		}

		var checkTeam = data[0];
		var pwHash = checkTeam.pass;

		if (common.validatePassword(confirm, pwHash)) {
			common.db.collection("accounts").find({
				teamname: nTeamname
			}).toArray(function(err, d) {
				if (err) {
					res.send({
						success: 0,
						message: "An error occurred"
					});
				}
				if (nTeamname == checkTeam.teamname || d.length == 0) {
					var changePassword = nPassword && nPassword.length > 0;
					var salt = common.generateSalt();
					common.db.collection("accounts").update({
						$or: [
							{ tid: req.session.id },
							{ _id: _id }
						]
					}, {
						$set: common.extend({
							teamname: nTeamname,
							school: nSchool
						}, changePassword?{
							pass: salt + common.md5(nPassword + salt)
						}:{})
					}, function(err, data) {
						if (err) {
							res.send({
								success: 0,
								message: "Not successful"
							});
							return;
						} else {
							res.send({
								success: 1,
								message: "Yay!!! Your account was updated"
							});
							return;
						}
					});
				}
			});
		} else {
			res.send({
				success: 0,
				message: "Invalid password"
			});
			return;
		}
	});
};

exports.get_shell_account = function(req, res) {
	var _id = new ObjectId(req.session.tid);
	common.db.collection("accounts").find({
		$or: [
			{ tid: req.session.id },
			{ _id: _id }
		]
	}).toArray(function(err, data) {
		if (err) {
			res.send({
				success: 0,
				message: "Internal error"
			});
			return;
		}
		if (data.length == 0) {
			res.send({
				success: 0,
				message: "Couldn't find your team."
			});
			return;
		}
		if (data.length > 1) {
			res.send({
				success: 0,
				message: "wat"
			});
			return;
		}

		var checkTeam = data[0];
		if (checkTeam.shell_user) {
			res.send({
				success: 1,
				uname: checkTeam.shell_user,
				pass: checkTeam.shell_pass
			});
			return;
		} else {
			common.db.collection("shell_accounts").find({
				open: {
					$ne: false
				}
			}).toArray(function(err2, data2) {
				if (err2) {
					res.send({
						success: 0,
						message: "Internal error"
					});
					return;
				}
				if (data2.length == 0) {
					res.send({
						success: 0,
						message: "No more accounts! D:"
					});
					return;
				}

				var shell_acc = data2[0];
				common.db.collection("accounts").update({
					$or: [
						{ tid: req.session.id },
						{ _id: _id }
					]
				}, {
					$set: {
						shell_user: shell_acc.username,
						shell_pass: shell_acc.password
					}
				}, function(err3, data3) {
					if (err3) {
						res.send({
							success: 0,
							message: "Internal error"
						});
						return;
					}
					common.db.collection("shell_accounts").update({
						username: shell_acc.username
					}, {
						$set: {
							open: false
						}
					}, function(err4, data4) {
						if (err4) {
							res.send({
								success: 0,
								message: "Internal error"
							});
							return;
						}
						res.send({
							success: 1,
							uname: shell_acc.username,
							pass: shell_acc.password
						});
						return;
					});
				});
			});
		}
	});
};
