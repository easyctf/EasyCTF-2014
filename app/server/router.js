var MongoDB = require("mongodb").Db;
var Server = require("mongodb").Server;

var extend = function(o1, o2) {
    var o = {};
    for (var attr in o1) {
        o[attr] = o1[attr];
    }
    for (var attr in o2) {
        o[attr] = o2[attr];
    }
    return o;
};

var db = new MongoDB("app29067833", new Server("kahana.mongohq.com", 10071, { auto_reconnect: true }), {w: 1});
db.open(function(err, db) {
    if (err) {
        console.dir(err);
    } else {
        console.log("yey connected.");
        db.authenticate("github_user", "__temporarypassword__", function(err, res) {
            if (err) {
                console.dir(err);
            } else {
                console.log("yey authenticated");
            }
        });
    }
});

var AM = require("./modules/account-manager");

module.exports = function(app) {
    app.get("/", function(req, res) {
        render(req, res, "easyctf", "EasyCTF 2014");
    });
    
    app.get("/about", function(req, res) {
        render(req, res, "about", "About - EasyCTF 2014");
    });

    app.get("/scores", function(req, res) {
        var query = db.collection("accounts").find().sort([['points', 1]]);
        query.toArray(function(e, d) {
            render(req, res, "scores", "Scoreboard - EasyCTF 2014", { accounts: d });
        });
    });
    
    app.get("/md5", function(req, res) {
        render(req, res, "md5", "MD5 Calculator - EasyCTF 2014");
    });

    /***   ***/
    
    app.get("/edit", function(req, res) {
        var tags = getTags();
        console.dir(tags);
        render(req, res, "edit-problems", "Edit Problems - EasyCTF 2014", {
            tags: tags,
        });
    });
    
    app.get("/problems", function(req, res) {
        render(req, res, "problems", "Problems - EasyCTF 2014", {

        });
    });
    
    app.get("/profile", function(req, res) {
        render(req, res, "profile", "My Team - EasyCTF 2014");
    });
    
    app.get("/profile/:teamID", function(req, res) {
        res.render("profile", {
            title: "Team: " + req.params.teamID + " - EasyCTF 2014",
            teamID: req.params.teamID,
        });
    });

    app.get("/register", function(req, res) {
        render(req, res, "register", "Register - EasyCTF 2014");
    });

    app.post("/register", function(req, res) {
        var result = {};
        var errors = [];

        if (!validateEmail(req.param("email"))) {
            errors.push("Invalid email.");
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
                    var sendgrid  = require('sendgrid')("app29067833@heroku.com" || process.env.SENDGRID_USERNAME, "0o6xvuek" || process.env.SENDGRID_PASSWORD);
                    sendgrid.send({
                        to:       req.param("email"),
                        from:     'michael@easyctf.com',
                        fromname: "Michael Zhang",
                        replyto: "failed.down@gmail.com",
                        subject:  'Welcome to EasyCTF!',
                        text:     'Thanks for participating in EasyCTF 2014! '
                    }, function(err, json) {
                        if (err) { return console.error(err); }
                        console.log(json);
                    });
                    result.message = "<p>You have registered successfully!</p>";
                }
                result.errors = errors;
                res.send(result);
            });
        } else {
            result.errors = errors;
            result.message = "<p>You need to recheck the following items:</p><ul>";
            for(var i=0; i<errors.length; i++) {
                result.message += "<li>" + errors[i] + "</li>"
;            }
            result.message += "</ul>";
            res.send(result);
        }
    });

    app.get("/login", function(req, res) {
        render(req, res, "login", "Login - EasyCTF 2014");
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

    app.get("/logout", function(req, res) {
        res.clearCookie("email");
        res.clearCookie("pass");
        req.session.destroy(function(e) {
            res.redirect("/");
        });
    });
};

var render = function(req, res, url, title, extraparams) {
    var p;
    if (req.session && req.session.user) {
        AM.autoLogin(req.session.user.email, req.session.user.pass, function(o) {
            p = {
                title: title,
                logged: o != null,
                group: o ? o.group : 0,
            };
            p = extend(p, extraparams ? extraparams : {});
            res.render(url, p);
            // console.dir(p);
        });
    } else {
        if (req.cookies.email && req.cookies.pass) {
            AM.autoLogin(req.cookies.email, req.cookies.pass, function(o) {
                p = {
                    title: title,
                    logged: o != null,
                    group: o ? o.group : 0,
                };
                p = extend(p, extraparams ? extraparams : {});
                res.render(url, p);
                // console.dir(p);
            });
        } else {
            p = {
                title: title,
                logged: false,
                group: 0,
            };
            p = extend(p, extraparams ? extraparams : {});
            res.render(url, p);
            // console.dir(p);
        }
    }
};

var getTags = function(callback) {
    var query = db.collection("tags").find();
    query.toArray(function(e, d) {
        if (e) callback(e);
        callback(d);
    });
};

var validateEmail = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};