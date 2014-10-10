module.exports = function(app) {
  app.get("/sites/iti/", function(req, res) {
    res.render("hack-site/iti/index", { title: "Institute of Technological Incompetence" });
  });
};
