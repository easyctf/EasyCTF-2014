(function() {
	$("#send-feedback").click(function() {
		$.ajax({
			url: "/api/feedback",
			method: "POST",
			data: {
				name: $("#name").val(),
				email: $("#email").val(),
				message: $("#message").val()
			}
		}).done(function(data) {
			var alert_class = "";
			if (data.status === 1) {
				alert_class = "success";
			} else {
				alert_class = "danger";
			}

			$("#feedback_msg").hide().html("<div class=\"alert alert-" + alert_class + "\"> " + data['message'] + " </div>").slideDown("normal");
			return setTimeout(function() {
				return $("#feedback_msg").slideUp("normal", function() {
					$("#feedback_msg").html("").show();
					window.location.reload(true);
				});
			}, 2000);
		});
	});
})();