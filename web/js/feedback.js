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

		});
	});
})();