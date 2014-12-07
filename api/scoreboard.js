var common = require("./common");
var fs = require("fs");
var async = require("async");
var moment = require("moment");
var ObjectId = require("mongodb").ObjectID;

exports.get_group_scoreboards = function(tid) {

};

exports.get_public_scoreboard = function() {
	// generate_scoreboard_page();
	return {
		path: "/staticscoreboard.html",
		group: "Public"
	};
};

exports.scoreboard_graph = function(req, res) {
	// generate_scoreboard_graph();
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.header('Expires', '-1');
	res.header('Pragma', 'no-cache');
	res.sendfile("web/staticscoreboardgraph.json");
};

var generate_scoreboard_graph = function() {
	var path = "web/staticscoreboardgraph.json";
	var teamJson = [];
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
							teams[i].lastUpdated = 0;
							var points = 0;
							for(var j=0; j<submissions.length; j++) {
								if (submissions[j].tid.indexOf(teams[i]._id.valueOf()) > -1) {
									var time = moment(submissions[j].timestamp).diff(common.startDate);
									if (time > teams[i].lastUpdated) {
										teams[i].lastUpdated = time;
									}
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
							return a.lastUpdated - b.lastUpdated;
						});

						for(var i=0; i<5; i++) {
							teamJson.push({
								tid: teams[i].tid,
								place: (i+1),
								teamname: teams[i].teamname,
								school: teams[i].school,
								points: teams[i].points
							});
						}

						var nTeamJson = [];

						async.each(teamJson, function(team, callback) {
							common.db.collection("accounts").find({
								_id: new ObjectId(team.tid)
							}).toArray(function(err, accounts) {
								if (accounts.length == 1) {
									var account = accounts[0];
									common.db.collection("submissions").find({
										tid: team.tid,
										correct: true,
									}).sort({
										timestamp: 1
									}).toArray(function(err, data) {
										team.submissions = data;
										team.p = 0;
										nTeamJson.push(team);
										callback();
									});
								}
							})
						}, function(err) {
							// console.dir(nTeamJson);

							var indices = [];
							for(var i=0; i<5; i++) {
								for(var j=0; j<nTeamJson[i].submissions.length; j++) {
									var index = moment(nTeamJson[i].submissions[j].timestamp).diff(common.startDate);
									if (!(index in indices)) {
										indices.push(parseInt(index));
									}
								}
							}

							indices = indices.sort(function(a, b){return a-b});
							nTeamJson = nTeamJson.sort(function(a, b){return a.place-b.place});
							var arr = [];

							var names = ["Time"];
							var init = [0];
							for(var i=0; i<nTeamJson.length; i++) {
								names.push(nTeamJson[i].teamname);
								init.push(0);
							}
							arr.push(names);
							arr.push(init);
							// console.dir(arr);
							
							for(var i=0; i<indices.length; i++) {
								var a1 = [indices[i]];
								for(var j=0; j<nTeamJson.length; j++) {
									if (nTeamJson[j].submissions.length > 0) {
										var time = moment(nTeamJson[j].submissions[0].timestamp).diff(common.startDate);
										if (time == indices[i]) {
											nTeamJson[j].p += nTeamJson[j].submissions[0].pts;
											nTeamJson[j].submissions.shift();
										}
									}
									a1.push(nTeamJson[j].p);
								}
								arr.push(a1);
							}
							var last = [moment().diff(common.startDate)];
							for(var i=0; i<nTeamJson.length; i++) {
								last.push(nTeamJson[i].points);
							}
							arr.push(last);

							var finalData = {};
							finalData.options = {
								title: "EasyCTF 2014 Score Progression",
								/* curveType: "function", */
								height: 348,
								legend: {
									"position": "bottom"
								},
								hAxis: {
									textPosition: "none",
								},
								vAxis: {
									viewWindowMode: "explicit",
									viewWindow: {
										min: 0,
										max: 4500
									}
								}
							};
							finalData.points = arr;
							finalData.success = 1;

							fs.chmodSync(path, 0755);

							fs.writeFile(path, JSON.stringify(finalData), function(err) {
								if (err) {
									console.log("[api/scoreboard.js] error when generating scoreboard graph");
								} else {
									console.log("[api/scoreboard.js] generated scoreboard graph");
								}
							});

							// console.log("all done!");
						});
					}
				});
			});
		}
	});
};

var generate_scoreboard_page = function() {
	var teamJson = [];
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
						var content = "";
						var path = "web/staticscoreboard.html";

						content += "<table class=\"table table-striped table-hover\" style=\"table-layout:fixed;width:100%;\">\r\n";
						content += "\t<thead><tr>\r\n\t\t<th style=\"width:10%;\">Place</th>\r\n\t\t<th style=\"width:60%;\">Team</th>\r\n\t\t<th style=\"width:20%;\">Affiliation</th>\r\n\t\t<th style=\"width:10%;\">Score</th></tr></thead>\r\n";
						for(var i=0; i<teams.length; i++) {
							var points = 0;
							teams[i].lastUpdated = 0;
							for(var j=0; j<submissions.length; j++) {
								if (submissions[j].tid.indexOf(teams[i]._id.valueOf()) > -1) {
									var time = moment(submissions[j].timestamp).diff(common.startDate);
									if (time > teams[i].lastUpdated) {
										teams[i].lastUpdated = time;
									}
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
							return a.lastUpdated - b.lastUpdated;
						});

						for(var i=0; i<teams.length; i++) {
							content += "\t<tr>\r\n";
							content += "\t\t<td>"+(i+1)+"</td>\r\n";
							content += "\t\t<td style=\"word-break:break-all;\">"+teams[i].teamname+"</td>\r\n";
							content += "\t\t<td style=\"word-break:break-all;\">"+teams[i].school+"</td>\r\n";
							content += "\t\t<td>"+teams[i].points+"</td>\r\n";
							content += "\t</tr>\r\n";

							teamJson.push({
								place: (i+1),
								teamname: teams[i].teamname,
								school: teams[i].school,
								points: teams[i].points
							});

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