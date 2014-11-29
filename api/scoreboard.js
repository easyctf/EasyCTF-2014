var common = require("./common");
var fs = require("fs");

exports.get_group_scoreboards = function(tid) {

};

exports.get_public_scoreboard = function() {
	generate_scoreboard_page();
	return {
		path: "/staticscoreboard.html",
		group: "Public"
	};
};

var generate_scoreboard_page = function() {
	common.db.collection("accounts").find({
		group: 1
	}).toArray(function(err, teams) {
		if (err) {
			console.log("[api/scoreboard.js] something went wrong");
		} else {
			common.db.collection("submissions").find({

			}).toArray(function(err2, submissions) {
				common.db.collection("problems").find({

				}).toArray(function(err3, problems) {
					if (err3) {
						// fuck
					} else {
						var content = "";
						var path = "web/staticscoreboard.html";

						content += "<table class=\"table table-striped table-hover\" style=\"width:100%;word-wrap:break-all;\">\r\n";
						content += "\t<thead><tr>\r\n\t\t<th>Place</th>\r\n\t\t<th>Team</th>\r\n\t\t<th>Affiliation</th>\r\n\t\t<th>Score</th></tr></thead>\r\n";
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

						for(var i=0; i<teams.length; i++) {
							content += "\t<tr>\r\n";
							content += "\t\t<td>"+(i+1)+"</td>\r\n";
							content += "\t\t<td>"+teams[i].teamname+"</td>\r\n";
							content += "\t\t<td>"+teams[i].school+"</td>\r\n";
							content += "\t\t<td>"+teams[i].points+"</td>\r\n";
							content += "\t</tr>\r\n";

							// console.log(teams[i].teamname + " " + points);
						}
						content += "</table>\r\n";

						fs.chmodSync(path, 0755);
						fs.writeFile(path, content, function(err) {
							if (err) {
								console.log("[api/scoreboard.js] error when generating scoreboard");
							} else {
								console.log("[api/scoreboard.js] generated scoreboard");
							}
						});
					}
				});
			});
		}
	});
};