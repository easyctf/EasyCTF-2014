module.exports = function(app) {
  app.get(["/sites/iti", "/sites/iti/", "/sites/iti/index.php"], function(req, res) {
    res.render("hack-site/iti/index", { title: "Institute of Technological Incompetence" });
  });

  app.get("/sites/iti/faculty.php", function(req, res) {
    res.render("hack-site/iti/faculty", { title: "Faculty - Institute of Technological Incompetence" });
  });

  app.get("/sites/iti/portal.php", function(req, res) {
    res.render("hack-site/iti/honor", { title: "Portal - Institute of Technological Incompetence" });
  });
};
