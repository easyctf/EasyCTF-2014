module.exports = function(app) {
  app.get(["/sites/iti", "/sites/iti/", "/sites/iti/index.php"], function(req, res) {
    res.render("hack-site/iti/index", { title: "Institute of Technological Incompetence" });
  });
};
