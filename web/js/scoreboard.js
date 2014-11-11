(function() {
	window.load_scoreboards = function() {
		console.log("loading scoreboards...");
		return $.ajax({
			type: "GET",
			cache: false,
			url: "/api/scoreboards",
			dataType: "json"
		}).done(function(data) {
			console.dir(data);
			var html_select = "";
			var html_scores = "";

			for(var i=0, len=data.length; i<len; i++) {
				var d = data[i];
				if (d['path'] != null) {
					group = d.group;
					$.ajax({
						type: "GET",
						url: d['path'],
						dataType: "html",
						cache: false,
						async: true
					}).done(function(stat) {
						if (group === "Public") {
							return $("#public_scoreboard_container").html(stat);
						} else {
							html_select += "<li><a onclick=\"switch_scoreboard('" + group + "');\">" + group + "</a></li>";
							return html_scores += "<div style='display:none;' id='scoreboard_" + group + "' class='scoreboard'>" + stat + "</div>";
						}
					});
				}
			}
		});
	};

	window.switch_scoreboard = function(group) {

	};

	window.load_solved_problems = function() {

	};

	window.load_teamscore = function() {

	};
}).call(this);