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

	var flags = [
		"",
		"now_go_sign_up_and_do_the_real_challenges"
	];

	window.show_hint = function(i) {
		$("#hint_"+i).slideToggle();
	}

	window.handle_submit = function(i) {
		var guess = $("#q" + i).val();
		var html;
		if (guess.toLowerCase().indexOf(flags[i].toLowerCase()) > -1) {
			html = "<div class='alert alert-success'>Congratulations!</div>";
		} else {
			html = "<div class='alert alert-danger'>Nope, that's not right. If you want to know the answers, check <code>js/about.js</code>!</div>";
		}
		$("#msg_" + i).hide().html(html).slideDown("normal");
		setTimeout(function() {
			$("#msg_"+i).slideUp("normal", function() {
				$("#msg_"+i).html("").show();
			});
		}, 2000);
	}
})();