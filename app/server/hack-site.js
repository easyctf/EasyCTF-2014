module.exports = function(app) {
  app.get(["/sites/post-it", "/sites/post-it/", "/sites/post-it/index.php"], function(req, res) {
  	res.render("sites/post-it/index");
  });

  app.post(["/sites/post-it", "/sites/post-it/", "/sites/post-it/index.php"], function(req, res) {
  	if (req.param("user") == "flag" && req.param("request") == "flag") {
	  	res.send("flag: p0st_is_moar_secure_than_g3t");
  	} else {
  		res.render("sites/post-it/index");
  	}
  });
};
