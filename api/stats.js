var common = require("./common");

module.exports = function(app) {
	app.get("/api/stats/solved", function(req, res) {
		get_solved_p(req, res);
	});

	app.get("/api/stats/top", function(req, res) {
		get_top_n(req, res);
	});
};

var get_solved_p = function(req, res) {
	var problem = req.param("pname");
	if (!problem) {
		res.send({
			status: 0,
			message: "Need to specify a problem"
		});
		return;
	}
	common.db.collection("problems").find({
		displayname: new RegExp("^" + problem.toLowerCase(), "i")
	}).toArray(function(err, doc) {
		if (err) {
			res.send({
				status: 0,
				message: "Error"
			});
			return;
		}
		if (doc.length == 0) {
			res.send({
				status: 0,
				message: "Problem not found"
			});
			return;
		}
		if (doc.length > 1) {
			res.send({
				status: 0,
				message: "Error"
			});
			return;
		}
		var pid = doc[0].pid;
		common.db.collection("submissions").find({
			pid: pid,
			correct: true
		}).toArray(function(err2, doc2) {
			if (err2) {
				res.send({
					status: 0,
					message: "Error"
				});
				return;
			}
			res.send({
				status: 1,
				nTeams: doc2.length - 1
			});
		});
	});
};

var get_top_n = function(req, res) {
	var num = req.param("num") ? parseInt(req.param("num")) : 5;
	common.db.collection("accounts").find({
		group: 1
	}).toArray(function(err, teams) {
		if (err) {
			console.log("[api/scoreboard.js] something went wrong");
		} else {
			common.db.collection("submissions").find({
				correct: true,
			}).toArray(function(err2, submissions) {
				common.db.collection("problems").find({
				}).toArray(function(err3, problems) {
					if (err3) {
						// fuck
					} else {
						for(var i=0; i<teams.length; i++) {
							var points = 0;
							for(var j=0; j<submissions.length; j++) {
								if (submissions[j].tid.indexOf(teams[i]._id.valueOf()) > -1) {
									var prob_points;
									for(var k=0; k<problems.length; k++) {
										if (problems[k].pid == submissions[j].pid) {
											prob_points = problems[k].basescore;
											break;
										}
									}
									points += prob_points;
								}
							}
							teams[i].points = points;
						}

						teams.sort(function(a, b) {
							if (a.points > b.points) {
								return -1;
							}
							if (a.points < b.points) {
								return 1;
							}
							return 0;
						});

						var teamJson = [];
						for(var i=0; i<Math.min(num, teams.length); i++) {
							teamJson.push({
								tid: teams[i].tid,
								teamname: teams[i].teamname,
								school: teams[i].school,
								points: teams[i].points,
								place: (i+1)
							});
						}

						res.send(teamJson);
						return;
					}
				});
			});
		}
	});
}