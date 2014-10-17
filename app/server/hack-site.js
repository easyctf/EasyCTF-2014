module.exports = function(app) {
  app.get(["/sites/post-it", "/sites/post-it/", "/sites/post-it/index.php"], function(req, res) {
  	res.render("sites/post-it/index");
  });

  app.post(["/sites/post-it", "/sites/post-it/", "/sites/post-it/index.php"], function(req, res) {
  	if (req.param("user") == "admin" && req.param("request") == "flag") {
	  	res.send("flag: p0st_is_moar_secure_than_g3t");
  	} else {
  		res.render("sites/post-it/index");
  	}
  });

  app.get(["/sites/pointless-keys", "/sites/pointless-keys/", "/sites/pointless-keys/index.php"], function(req, res) {
    res.render("sites/pointless-keys/index");
  });

  app.post(["/sites/pointless-keys/flag.php"], function(req, res) {
    var a = req.param("target").join(",");
    var b = req.param("keys").join(",");
    if (b.indexOf(a) >= 0) {
      res.send("flag is konami_c0dez");
    }
  });
};
