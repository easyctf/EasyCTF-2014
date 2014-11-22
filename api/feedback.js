var common = require("./common");
var moment = require("moment");

exports.upload_feedback = function(req, res) {
	if (!(req.param("name") && req.param("email") && req.param("message"))) {
		res.send({
			status: 0,
			message: "You must fill out all of the fields."
		});
		return;
	}
	common.db.collection("feedback").insert({
		name: req.param("name"),
		email: req.param("email"),
		message: req.param("message"),
		timestamp: moment().format()
	}, { w: 1 }, function(err, data) {
		if (err) {
			res.send({
				status: 0,
				message: "Internal error"
			});
			return;
		}
		res.send({
			status: 1,
			message: "Thanks for your feedback!"
		});
		return;
	});
};