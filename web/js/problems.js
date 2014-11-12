(function() {
	window.load_problems = function() {
		$.ajax({
			type: "GET",
			cache: false,
			url: "/api/problems",
			dataType: "json"
		}).done(function(data) {

		});
	};
}).call(this);