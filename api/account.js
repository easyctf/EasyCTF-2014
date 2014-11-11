var common = require("./common");
var group = require("./group");

exports.register_team = function(req, res) {
	var email = req.param("email");
	var teamname = req.param("team");
	var school = req.param("school");
	var pwd = req.param("pass");
	var gname = req.param("group");
	var joingroup = req.param("joingroup");

	if (!(email && teamname && school && pwd && email.length > 0 && teamname.length > 0 && school.length > 0 && pwd.length > 0)) {
		res.send({
			status: 0,
			message: "Please fill out all of the required fields."
		});
		return;
	}

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
					group: 1
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