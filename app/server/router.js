var AM = require("./modules/account-manager");

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

    app.post("/register", function(req, res) {
        AM.addNewAccount({
            teamname: req.param("name"),
            email: req.param("email"),
            school: req.param("school"),
            pass: req.param("password"),
        }, function(e) {
            if (e) {
                res.send(e, 400);
            } else {
                res.send("ok", 200);
            }
        });
    });
};