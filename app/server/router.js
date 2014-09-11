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
        var result = {};
        var errors = [];

        if (!(req.param("email") && req.param("name") && req.param("school") && req.param("pass"))) {
            errors.push("Please fill out all fields.");
            result.errors = errors;
            result.message = "<p>You need to recheck the following items:</p><ul>";
            for(var i=0; i<errors.length; i++) {
                result.message += "<li>" + errors[i] + "</li>";
            }
            result.message += "</ul>";
            res.send(result);
        }

        var email = req.param("email").trim();
        var teamname = req.param("name").trim();
        var school = req.param("school").trim();
        var password = req.param("pass").trim();

        if (!validateEmail(email)) {
            errors.push("Email address is not valid.");
        }
        if (name.length < 1) {
            errors.push("Team name must not be empty.");
        }
        if (school.length < 1) {
            errors.push("School name must not be empty.");
        }
        if (password.length < 6) {
            errors.push("Password must be at least 6 characters long.");
        }
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
        res.send(result);
    });
};

var validateEmail = function(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};