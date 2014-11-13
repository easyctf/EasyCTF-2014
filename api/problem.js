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

};