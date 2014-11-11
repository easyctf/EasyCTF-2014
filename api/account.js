exports.register_team = function(req, res) {
	var email = req.param("email");
	var teamname = req.param("teamname");
	var school = req.param("school");
	var pwd = req.param("pass");
	var gname = req.param("group").toLowerCase();
	var joingroup = req.param("joingroup");

	if ("" in [email, teamname, school, pwd]) {
		res.send({
			status: 0,
			message: "Please fill out all of the required fields."
		});
		return;
	}
};