var auth = require("./auth");

module.exports = function(app) {
	app.get("/api/isloggedin", function(req, res) {
		res.send(auth.is_logged_in(req));
	});
};