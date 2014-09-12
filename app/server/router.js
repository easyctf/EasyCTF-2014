var AM = require("./modules/account-manager");

module.exports = function(app) {
    app.get("/", function(req, res) {
        if (req.session && req.session.user) {
            AM.autoLogin(req.session.user.email, req.session.user.pass, function(o) {
                res.render("easyctf", {
                    title: "EasyCTF 2014",
                    logged: o != null
                });
            });
        } else {
            if (req.cookies.email && req.cookies.pass) {
                AM.autoLogin(req.cookies.email, req.cookies.pass, function(o) {
                    res.render("easyctf", {
                        title: "EasyCTF 2014",
                        logged: o != null
                    });
                });
            } else {
                res.render("easyctf", {
                    title: "EasyCTF 2014",
                    logged: false
                });
            }
        }
    });

    app.get("/logout", function(req, res) {
        res.clearCookie("email");
        res.clearCookie("pass");
        req.session.destroy(function(e) {
            res.redirect("/");
        });
    });

    app.get("/login", function(req, res) {
        if (req.cookies.email == undefined || req.cookies.pass == undefined) {
            res.render("login", {
                title: "Login - EasyCTF 2014"
            });
        } else {
            AM.autoLogin(req.cookies.email, req.cookies.pass, function(o) {
                if (o != null) {
                    req.session.user = o;
                    res.redirect("/");
                } else {
                    res.render("login", {
                        title: "Login - EasyCTF 2014"
                    });
                }
            });
        }
    });

    app.post("/login", function(req, res) {
        AM.manualLogin(req.param("email"), req.param("password"), function(e, o) {
            var result = {};
            var errors = [];

            if (!o) {
                errors.push(e);
            } else {
                req.session.user = o;
                if (req.param("remember") == "true") {
                    res.cookie("email", o.email, { maxAge: 900000 });
                    res.cookie("pass", o.pass, { maxAge: 900000 });
                }
            }

            if (errors.length > 0) {
                result.message = "<p>You need to recheck the following items:</p><ul>";
                for(var i=0;i<errors.length;i++) {
                    result.message += "<li>" + errors[i] + "</ul>";
                }
                result.message += "</ul>";
            } else {
                result.message = "<p>You have logged in successfully!</p>";
            }

            result.errors = errors;
            res.send(result);
        });
    });

    app.get("/register", function(req, res) {
        res.render("register", {
            title: "Register - EasyCTF 2014"
        });
    });

    app.post("/register", function(req, res) {
        var result = {};
        var errors = [];

        if (errors.length == 0) {
            AM.addNewAccount({
                teamname: req.param("name"),
                email: req.param("email"),
                school: req.param("school"),
                pass: req.param("password"),
            }, function(e) {
                if (e) {
                    errors.push(e);
                    result.message = "<p>Something went wrong:</p><ul>";
                    for(var i=0; i<errors.length; i++) {
                        result.message += "<li>" + errors[i] + "</li>";
                    }
                    result.message += "</ul>";
                } else {
                    result.message = "<p>You have registered successfully!</p>";
                }
                result.errors = errors;
                res.send(result);
            });
        } else {
            result.errors = errors;
            result.message = "<p>You need to recheck the following items:</p><ul>";
            for(var i=0; i<errors.length; i++) {
                result.message += "<li>" + errors[i] + "</li>";
            }
            result.message += "</ul>";
            res.send(result);
        }
    });
};

var validateEmail = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};