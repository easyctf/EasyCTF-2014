var common = require("./common");

exports.get_group_membership = function(tid, res) {
	var groups = [];
	var owners = [];

	common.db.collection("groups").find({
		owners: {
			$in: [ tid ]
		}
	}).sort({
		name: 1,
		gid: 1
	}).toArray(function(err, doc) {
		for(var i=0; i<doc.length; i++) {
			var g = doc[i];
			groups.push({
				name: g['name'],
				gid: g['gid'],
				owner: true
			});
			owners.push(g['gid']);
		}
		common.db.collection("groups").find({
			members: {
				$in: [ tid ]
			},
			owners: {
				$nin: [ tid ]
			}
		}).sort({
			name: 1,
			gid: 1
		}).toArray(function(err, doc) {
			for(var i=0; i<doc.length; i++) {
				var g = doc[i];
				groups.push({
					name: g['name'],
					gid: g['gid'],
					owner: false
				});
			}
			// console.dir(groups);
			res.send(groups);
			return;
		});
	});
};

exports.create_group = function(id, gname, res) {
	if (!gname || gname == "") {
		res.send({
			status: 0,
			message: "Group name cannot be empty!"
		});
		return;
	} else {
		common.db.collection("groups").find({
			name: gname,
		}).toArray(function(err, doc) {
			if (doc.length > 0) {
				res.send({
					status: 2,
					message: "This group exists; would you like to join it?"
				});
				return;
			} else {
				common.db.collection("groups").insert({
					name: gname,
					owners: [ id.toString() ],
					members: [ id.toString() ],
					gid: common.token()
				}, { w: 1 }, function(err, doc) {
					if (err) {

					} else {
						res.send({
							status: 1,
							message: "Succssfully created the group!"
						});
						return;
					}
				});
			}
		});
	}
};