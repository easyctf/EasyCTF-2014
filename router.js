var pages = ["account", "problems", "about", "news", "feedback", "irc", "login", "logout", "passreset", "teamnamelookup", "contact", "learn", "compete", "faq", "teachers", "register", "shell", "sponsors", "scoreboard"];

module.exports = function(app) {
	for(var i=0; i<pages.length; i++) {
		(function() {
			app.get("/" + pages[i], function(req, res) {
				res.sendfile("web" + req.url + ".html", { root: __dirname });
			});
		})();
	}
};