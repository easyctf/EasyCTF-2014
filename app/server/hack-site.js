module.exports = function(app) {
  app.get(["/sites/iti", "/sites/iti/", "/sites/iti/index.php"], function(req, res) {
    res.render("hack-site/iti/index", { title: "Institute of Technological Incompetence" });
  });

  app.get(["/sites/post-it", "/sites/post-it/", "/sites/post-it/index.php"], function(req, res) {
  	res.render("sites/post-it/index");
  });

  app.post(["/sites/post-it", "/sites/post-it/", "/sites/post-it/index.php"], function(req, res) {
  	res.send("flag: p0st_is_moar_secure_than_g3t");
  });
};
