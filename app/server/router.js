module.exports = function(app) {
    app.get("/", function(req, res) {
        res.render("easyctf", {
            title: "EasyCTF 2014"
        });
    });
};