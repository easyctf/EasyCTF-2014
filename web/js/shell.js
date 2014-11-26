(function() {
	window.retrieve_credentials = function() {
		$.ajax({
			url: "/api/shell",
			type: "GET",
			dataType: "json"
		}).done(function(data) {
			if (data.success == 1) {
				$("#credentials").html("username: <code>" + data.uname + "</code> | password: <code>" + data.pass + "</code>");
			} else {
				$("#credentials").html('Retrieving failed... <a href="javascript:retrieve_credentials();">try again?</a>');
			}
		});
	};
})();