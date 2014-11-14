var common = require("./common");
var ObjectID = require("mongodb").ObjectID;

exports.load_unlocked_problems = function(tid, callback) {
	var unlocked = [];
	common.db.collection("accounts").findOne({
		$or: [
			{ _id: new ObjectID(tid) },
			{ tid: tid }
		]
	}, function(err, team) {
		if (err) {
			// fuck
			console.dir(err);
		} else {
			if (!('probinstance' in team)) {
				common.db.collection("accounts").update({
					$or: [
						{ _id: new ObjectID(tid) },
						{ tid: tid }
					]
				}, {
					$set: {
						'probinstance': { }
					}
				}, function() {
				});
				team.probinstance = { };
			}
			common.db.collection("submissions").find({
				tid: tid,
				correct: true
			}).toArray(function(err, doc) {
				if (err) {
					// fuck
					console.dir(err);
				} else {
					var correctPIDs = [];
					for(var i=0; i<doc.length; i++) {
						correctPIDs.push(doc[i].pid);
					}
					common.db.collection("problems").find().toArray(function(err, doc) {
						for(var i=0; i<doc.length; i++) {
							var p = doc[i];
							var b = false;
							if (!("weightmap" in p && "threshold" in p)) {
								b = true;
							} else {
								var weightsum = 0;
								for(var i=0; i<correctPIDs.length; i++) {
									weightsum += p.weightmap[correctPIDs[i]];
								}
								if (weightsum >= p.threshold) {
									b = true;
								}
							}
							if (b) {
								unlocked.push({
									pid: p.pid,
									displayname: p.displayname,
									hint: p.hint,
									basescore: p.basescore,
									correct: p.pid in correctPIDs,
									desc: p.autogen ? build_problem_instance(p, tid) : p.desc
								});
							}
						}
						unlocked.sort(function(a, b) {
							if (a.basescore > b.basescore) {
								return 1;
							} else if (a.basescore < b.basescore) {
								return -1;
							} else {
								return 0;
							}
						});
						callback(unlocked);
					});
				}
			});
		}
	});
};

exports.get_single_problem = function(pid, tid, callback) {
	exports.load_unlocked_problems(tid, function(unlocked) {
		for(var i=0; i<unlocked.length; i++) {
			var prob = unlocked[i];
			if (prob.pid == pid) {
				callback(problem);
				return;
			}
		}
		callback({
			status: 0,
			message: "Internal error, problem not found."
		});
		return;
	});
};

exports.submit_problem = function(tid, req, callback) {
	var pid = req.param("pid");
	var key = req.param("key");
	var correct = false;

	if (pid == undefined || pid.length == 0) {
		callback({
			status: 0,
			points: 0,
			message: "Problem ID cannot be empty. /* fuck you */"
		});
		return;
	}
	if (key == undefined || key.length == 0) {
		callback({
			status: 0,
			points: 0,
			message: "Answer cannot be empty."
		});
		return;
	}
	exports.load_unlocked_problems(tid, function(unlocked) {
		var pids = [];
		for(var i=0; i<unlocked.length; i++) {
			pids.push(unlocked[i].pid);
		}

		if (!(pid in pids)) {
			callback({
				status: 0,
				points: 0,
				message: "You cannot submit problems that you haven't unlocked yet! (a.k.a. stop trying to XSS)"
			});
			return;
		}
		
		common.db.findOne({
			pid: pid
		}, function(err, prob) {
			if (prob == undefined) {
				callback({
					status: 0,
					points: 0,
					message: "No problem ID in database, stahp XSS pls"
				});
				return;
			}

			if (!prob.autogen) {
				require("graders/" + prob.grader).grade(tid, key, function(obj) {

				});
			} else {

			}
		});
	});
};

var submit_problem_result = function(result, callback) {
	if (result.correct) {
		
	}
};