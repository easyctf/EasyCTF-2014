var auth = require("./auth");

module.exports = function(app) {
	app.post("/api/login", function(req, res) {
		res.send(auth.login(req));
	});

	app.get("/api/isloggedin", function(req, res) {
		res.send(auth.is_logged_in(req));
	});
};