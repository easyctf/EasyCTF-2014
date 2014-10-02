var MongoDB = require("mongodb").Db;
var Server = require("mongodb").Server;
var ObjectID = require("mongodb").ObjectID;
var jsdom = require("jsdom");
var moment = require("moment");
var crypto = require("crypto");

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
        getUsers(function(scores) {
            render(req, res, "scores", "Scoreboard - EasyCTF 2014", { accounts: scores });
        });
    });
    
    app.get("/md5", function(req, res) {
        render(req, res, "md5", "MD5 Calculator - EasyCTF 2014");
    });

    /***   ***/
    
    app.get("/edit", function(req, res) {
        logged(req, res, function(L) {
            var result = {};
            if (L && req.session.user.group == 3) {
                getProblems(function(problems) {
                    getTags(function(tags) {
                        render(req, res, "edit-problems", "Edit Problems - EasyCTF 2014", {
                            you: req.session.user.teamname,
                            problems: problems,
                            tags: tags,
                        });
                    });
                });
            }
        });
    });

    app.post("/edit/create.ajax", function(req, res) {
        logged(req, res, function(L) {
            var result = {};
            if (L) {
                var author = req.session.user.teamname;
                var title = req.param("pTitle");
                var text = req.param("pStatement");
                var answer = req.param("pAnswer");
                var value = parseInt(req.param("pValue"));
                var tags = parseInt(req.param("pTags"));
                db.collection("problems").insert({
                    author: author,
                    title: title,
                    text: text,
                    answer: answer,
                    value: value,
                    tags: tags,
                }, { w: 1 }, function(e, d) {
                    result.ret = 1;
                    res.send(result);
                });
            } else {
                result.ret = -1;
                res.send(result);
            }
        });
    });

    app.post("/edit/retrieve.ajax", function(req, res) {
        logged(req, res, function(L) {
            if (L) {
                getProblems(function(problems) {
                    for(var i=0; i<problems.length; i++) {
                        if (problems[i].author == req.session.user.teamname && problems[i]._id == req.param("pID")) {
                            res.send(extend(problems[i], { ret: 1 }));
                        }
                    }
                });
            }
        });
    });

    app.post("/edit/commit.ajax", function(req, res) {
        logged(req, res, function(L) {
            var result = {};
            if (L) {
                var author = req.session.user.teamname;
                var title = req.param("pTitle");
                var text = req.param("pStatement");
                var answer = req.param("pAnswer");
                var value = parseInt(req.param("pValue"));
                var tags = parseInt(req.param("pTags"));
                var cursor = db.collection("problems").find({ author: author, _id: new ObjectID(req.param("pID")) });
                cursor.toArray(function(e, d) {
                    if (e) {
                        // console.dir(e);
                        result.ret = -1;
                        res.send(result);
                    } else {
                        if (d.length == 1) {
                            db.collection("problems").update({
                                _id: new ObjectID(req.param("pID"))
                            }, {
                                author: author,
                                title: title,
                                text: text,
                                answer: answer,
                                value: value,
                                tags: tags,
                            }, function(e, d) {
                                if (e) {
                                    result.ret = -1;
                                    res.send(result);
                                } else {
                                    result.ret = 1;
                                    res.send(result);
                                }
                            })
                        }
                    }
                });
                /*
                db.collection("problems").insert({
                    author: author,
                    title: title,
                    text: text,
                    answer: answer,
                    value: value,
                    tags: tags,
                }, { w: 1 }, function(e, d) {
                    result.ret = 1;
                    res.send(result);
                });
                */
            } else {
                result.ret = -1;
                res.send(result);
            }
        });
    });
    
    app.get("/problems", function(req, res) {
        getProblems(function(problems) {
            getTags(function(tags) {
                render(req, res, "problems", "Problems - EasyCTF 2014", {
                    problems: problems,
                    tags: tags,
                });
            });
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
                result.message += "<li>" + errors[i] + "</li>";
            }
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

    app.get("/forgot", function(req, res) {
        render(req, res, "forgot", "Forgot Password - EasyCTF 2014");
    });

    app.post("/forgot.ajax", function(req, res) {
        var result = {};
        var salt = generateSalt();
        var code = md5(req.param("email") + salt) + salt;
        var expire = moment().add(48, "hours");
        db.collection("accounts").find({
            email: req.param("email"),
        }).toArray(function(e, d) {
            if (d.length > 0) {
                db.collection("reset_password").update({
                    email: req.param("email"),
                    active: true,
                }, {
                    $set: {
                        active: false,
                    }
                }, function(e, d) {
                    db.collection("reset_password").insert({
                        code: code,
                        email: req.param("email"),
                        salt: salt,
                        expire: expire,
                        active: true,
                    }, { w: 1 }, function(e, d) {
                        if (e) {
                            // console.dir(e);
                            result.ret = -1;
                        } else {
                            // console.dir(d);
                            result.ret = 1;
                        }
                        res.send(result);
                    });
                });
            } else {
                result.ret = -2;
                res.send(result);
            }
        });
    });

    app.post("/forgot/:code", function(req, res) {

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

var logged = function(req, res, callback) {
    if (req.session && req.session.user) {
        AM.autoLogin(req.session.user.email, req.session.user.pass, function(o) {
            if (o) {
                callback(true);
            } else {
                callback(false);
            }
        });
    } else {
        if (req.cookies.email && req.cookies.pass) {
            AM.autoLogin(req.cookies.email, req.cookies.pass, function(o) {
                // console.dir(o);
                req.session.user = o;
                if (o) {
                    callback(true);
                } else {
                    callback(false);
                }
            });
        } else {
            callback(false);
        }
    }
    return false;
};

var decodeEntities = function(input, i, callback) {
    jsdom.env(
        '',
        ["http://code.jquery.com/jquery.js"],
        function (errors, window) {
            callback(window.$("<div/>").html(input).text(), i);
            // console.log("contents of a.the-link:", window.$("a.the-link").text());
        }
    );
}

var getUsers = function(callback) {
    var query = db.collection("accounts").find().sort([['points', -1]]);
    query.toArray(function(e, d) {
        if (e) callback(e);
        else callback(d);
    });
}

var getTags = function(callback) {
    var query = db.collection("tags").find();
    query.toArray(function(e, d) {
        if (e) callback(e);
        else callback(d);
    });
};

var getProblems = function(callback) {
    var query = db.collection("problems").find().sort([['value', 1]]);
    query.toArray(function(e, d) {
        if (e) callback(e);
        else {
            var p = [];
            for (var i=0; i<d.length; i++) {
                var obj = d[i];
                p.push(obj);
            }
            callback(p);
        }
    });
};

var validateEmail = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

var md5 = function(str) {
    return crypto.createHash('md5').update(str).digest('hex');
};

var generateSalt = function() {
    var set = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
    var salt = "";
    for(var i=0; i<16; i++) {
        var p = Math.floor(Math.random() * set.length);
        salt += set[p];
    }
    return salt;
};