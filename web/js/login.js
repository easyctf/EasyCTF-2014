(function() {
	window.handle_login = function() {
		return $.ajax({
			type: "POST",
			cache: false,
			url: "/api/login",
			dataType: "json",
			data: {
				teamname: $("#log-team").val(),
				password: $("#log-pass").val()
			}
		}).done(function(data) {
			var alert_class;
			if (data['success'] === 0 || data['success'] === 2) {
				if (typeof Storage !== undefined) {
					sessionStorage.signInStatus = "notLoggedIn";
				}
				if (data['success'] === 0) {
					alert_class = "error";
				} else {
					alert_class = "info";
				}
				$("#login_msg").hide().html("<div class=\"alert-box " + alert_class + "\"> " + data['message'] + " </div>").slideDown("normal");
				return setTimeout(function() {
					return $("#login_msg").slideUp("normal", function() {
						return $("#login_msg").html("").show();
					});
				}, 2000);
			} else if (data['success'] === 1) {
				if (typeof Storage !== "undefined") {
					sessionStorage.signInStatus = "loggedIn";
				}
				return document.location.href = "compete.html";
			}
		});
	};
}).call(this);