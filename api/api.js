var auth = require("./auth");

module.exports = function(app) {
	app.post("/api/login", function(req, res) {
		auth.login(req, res);
	});

	app.get("/api/isloggedin", function(req, res) {
		res.send(auth.is_logged_in(req));
	});
};