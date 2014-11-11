var common = require("./common");
var fs = require("fs");

exports.get_group_scoreboards = function(tid) {

};

exports.get_public_scoreboard = function() {
	generate_scoreboard_page();
	return {
		path: "/staticscoreboard.html",
		group: "Public"
	};
};

var generate_scoreboard_page = function() {
	common.db.collection("accounts").find({}).toArray(function(err, data) {
		if (err) {
			console.log("[api/scoreboard.js] something went wrong");
		} else {
			var content = "";
			var path = "web/staticscoreboard.html";

			content += "<table>\r\n";
			content += "\t<tr>\r\n\t\t<th>Place</th>\r\n\t\t<th>Team</th>\r\n\t\t<th>Affiliation</th>\r\n\t\t<th>Score</th>\r\n";
			for(var i=0; i<data.length; i++) {
				content += "\t<tr>\r\n";
				content += "\t\t<td>"+(i+1)+"</td>\r\n";
				content += "\t\t<td>"+data[i].teamname+"</td>\r\n";
				content += "\t\t<td>"+data[i].school+"</td>\r\n";
				content += "\t\t<td>"+data[i].pointDisplay+"</td>\r\n";
				content += "\t</tr>\r\n";
			}
			content += "</table>\r\n";

			fs.chmodSync(path, 0755);
			fs.writeFile(path, content, function(err) {
				if (err) {
					console.log("[api/scoreboard.js] error when generating scoreboard");
				} else {
					console.log("[api/scoreboard.js] generated scoreboard");
				}
			});
		}
	});
};