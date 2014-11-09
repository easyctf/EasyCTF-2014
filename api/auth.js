exports.is_logged_in = function(req) {
	if ("tid" in req.session) {
		return {
			success: 1,
			message: "You appear to be logged in."
		};
	} else {
		return {
			success: 0,
			message: "You do not appear to be logged in."
		};
	}
};