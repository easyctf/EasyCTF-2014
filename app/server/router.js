module.exports = function(app) {
    app.get("/", function(req, res) {
        res.render("easyctf", {
            title: "EasyCTF 2014"
        });
    });

    app.get("/login", function(req, res) {
        if (req.cookies.user == undefined || req.cookies.pass == undefined) {
            res.render("login", {
                title: "Login - EasyCTF 2014"
            });
        } else {

        }
    });

    app.get("/register", function(req, res) {
        res.render("register", {
            title: "Register - EasyCTF 2014"
        });
    });
};