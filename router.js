var auth = require("./api/auth");

var pages = ["account", "noauth", "about", "updates", "feedback", "login", "logout", "passreset", "teamnamelookup", "contact", "learn", "faq", "teachers", "register", "sponsors", "scoreboard", "forgot"];
var auth_pages = ["problems", "exec", "irc", "compete", "shell"];

for(var i=0; i<auth_pages.length; i++) {
	pages.push(auth_pages[i]);
}

module.exports = function(app) {
	for(var i=0; i<pages.length; i++) {
		(function(i) {
			app.get("/" + pages[i], function(req, res) {
				// console.dir(auth.is_authorized(req));
				if (auth_pages.indexOf(pages[i]) > -1) {
					if (auth.is_authorized(req).success !== 1) {
						res.sendfile("web/noauth.html", { root: __dirname });
						return;
					}
				}
				res.sendfile("web" + req.url + ".html", { root: __dirname });
			});
		})(i);
	}
};