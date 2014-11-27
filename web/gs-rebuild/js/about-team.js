(function() {
	$.ajax({
		url: "js/data/team.json",
		method: "GET",
		dataType: "json"
	}).done(function(data) {
		html = "";
		for(var i=0; i<data.length; i++) {
			var m = data[i];
			html += "<div class='col-lg-3 col-md-6 col-sm-12'>";
				html += "<div class='panel panel-default'>";
					html += "<div class='panel-body' style='text-align:center;'>";
						if (m.name) {
							html += "<h3 style='margin:0;'>" + m.name + "</h3>";
						}
						if (m.role) {
							html += "<i>" + m.role + "</i>";
						}
						if (m.desc) {
							html += "<small>" + m.desc + "</small>";
						}
					html += "</div>";
				html += "</div>";
			html += "</div>";
		}
		$("#team-container").html(html);
	});
})();