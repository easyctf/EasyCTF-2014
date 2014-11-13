(function() {
	window.load_problems = function() {
		$.ajax({
			type: "GET",
			cache: false,
			url: "/api/problems",
			dataType: "json"
		}).done(function(data) {
			console.dir(data);
			var html = "<div class='panel-group' id='accordion' role='tablist' aria-multiselectable='true'>";
			for(var i=0; i<data.length; i++) {
				var d = data[i];
				var id = d.pid;
				html += "<div class='panel panel-default'>";
				html += "<div class='panel-heading' role='tab' id='heading"+i+"'>";
				html += "<h4 class='panel-title'>";
				html += "<a class='NO_HOVER_UNDERLINE_DAMMIT' data-toggle='collapse' data-parent='#accordion' href='#collapse"+i+"' aria-expanded='true' aria-controls='collapse"+i+"'>";
				html += d.displayname + ": " + d.basescore;
				html += "<span style='float:right;'>";
				html += d.correct ? "<span class='solved'>Solved</span>" : "<span class='unsolved'>Unsolved</span>";
				html += "</span>";
				html += "</a>";
				html += "</h4>";
				html += "</div>";
				html += "<div id='collapse"+i+"' class='panel-collapse collapse" + (d.correct ? "" : " in") + "' role='tabpanel' aria-labelledby='heading"+i+"'>";
				html += "<div class='panel-body'>";
				html += d.desc;
				html += "</div>";
				html += "</div>";
				html += "</div>";
			}
			html += "</div>";
			$("#problems_holder").html(html);
			$(".solved").parent().parent().next().hide();
		});
	};
}).call(this);