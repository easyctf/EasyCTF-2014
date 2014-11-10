exports.get_group_scoreboards = function(tid) {

};

exports.get_public_scoreboard = function() {
	return {
		path: "/staticscoreboard.html",
		group: "Public"
	};
};