var common = require("./common");

module.exports = function(app) {
	app.get("/api/stats/top", function(req, res) {
		get_top_n(req, res);
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
						for(var i=0; i<num; i++) {
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