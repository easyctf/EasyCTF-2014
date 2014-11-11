var common = require("./common");

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
					owners: [ id ],
					members: [ id ],
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