var MongoDB = require("mongodb").Db;
var Server = require("mongodb").Server;
var ObjectID = require("mongodb").ObjectID;
var jsdom = require("jsdom");
var moment = require("moment");
var crypto = require("crypto");
var sendgrid  = require('sendgrid')("app29067833@heroku.com" || process.env.SENDGRID_USERNAME, "0o6xvuek" || process.env.SENDGRID_PASSWORD);

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
        getUsers(function(users) {
            render(req, res, "scores", "Scoreboard - EasyCTF 2014", { accounts: users });
        });
    });
    
    app.get("/sponsors", function(req, res) {
        render(req, res, "sponsors", "Sponsors - EasyCTF 2014");
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
                getProblem(req.param("pID"), function(problem) {
                    var diff = parseInt(req.param("pValue")) - problem.value;
                    console.dir(diff);
                    db.collection("accounts").update({
                        solved: [ req.param("pID").toString() ],
                    }, {
                        $inc: {
                            pointDisplay: diff,
                        }
                    }, function(e, d) {
                        if (e) {

                        } else {
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
                        }
                    });
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
    
    app.get("/ide", function(req, res) {
        render(req, res, "ide", "IDE - EasyCTF 2014");
    });

    var existing = [
        "just-sum-numbers",
        "project-eratosthenes"
    ];

    app.post("/ide/data.ajax", function(req, res) {
        if (req.param("problem")) {
            var result = {};
            var pID = req.param("problem");

            if (existing.indexOf(pID) != -1) {
                var problem = require("./ide/"+pID+".js");
                var data = problem.data();
                req.session.data = data;
                res.send(data);
            }
        }
    });

    app.post("/ide/check.ajax", function(req, res) {
        if (req.session.data && req.param("output") && req.param("problem")) {
            var result = {};
            var pID = req.param("problem");
            var output = req.param("output");
            var data = req.session.data;

            if (existing.indexOf(pID) != -1) {
                var problem = require("./ide/"+pID+".js");
                if (problem.check(output, data)) {
                    result.correct = true;
                    result.flag = problem.flag();
                } else {
                    result.correct = false;
                }
                res.send(result);
            }
        }
    });
    
    app.get("/chat", function(req, res) {
        render(req, res, "chat", "Chat (#easyctf) - EasyCTF 2014");
    });
    
    app.get("/problems", function(req, res) {
        logged(req, res, function(logged) {
            if (logged) {
                getSolved(req, function(solved) {
                    if (solved != null) {
                        getProblems(function(problems) {
                            for(var i=0; i<problems.length; i++) {
                                if (solved.indexOf(problems[i]._id.toString()) >= 0) {
                                    problems[i].solved = true;
                                } else {
                                    problems[i].solved = false;
                                }
                            }
                            getTags(function(tags) {
                                render(req, res, "problems", "Problems - EasyCTF 2014", {
                                    problems: problems,
                                    tags: tags,
                                });
                            });
                        });
                    }
                });
            }
        })
    });

    app.post("/problems/submit.ajax", function(req, res) {
        // 46768dc744f93817a615fcab277ed8e9
        var result = {};
        logged(req, res, function(logged) {
            if (logged) {
                var submission = req.param("submission");
                if (submission.match("[a-fA-F0-9]{32}")) {
                    // check if already solved
                    if(req.session.user.solved.indexOf(req.param("pID").toString()) < 0) {
                        var c = false;
                        getProblems(function(problems) {
                            for(var i=0;i<problems.length;i++) {
                                if (problems[i]._id == req.param("pID")) {
                                    var obj = problems[i];
                                    var correct_answer = md5(obj.answer);
                                    c = correct_answer == submission;
                                    if (c) {
                                        console.log(obj.value);
                                        console.log(req.session.user._id);
                                        db.collection("accounts").update({
                                            _id: new ObjectID(req.session.user._id)
                                        }, {
                                            $inc: {
                                                pointDisplay: parseInt(obj.value),
                                            },
                                            $push: {
                                                solved: obj._id.toString(),
                                            }
                                        }, function(e, d) {
                                            if (e) {
                                                console.dir(e);
                                            } else {
                                                result.ret = 1;
                                                db.collection("submissions").insert({
                                                    tID: req.session.user._id,
                                                    pID: req.param("pID"),
                                                    content: req.param("submission"),
                                                    correct: true,
                                                    time: moment(),
                                                }, { w: 1 }, function(e, d) {
                                                    if (e) {
                                                        result.ret = -4;
                                                    } else {
                                                        res.send(result);
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        result.ret = 0;
                                        db.collection("submissions").insert({
                                            tID: req.session.user._id,
                                            pID: req.param("pID"),
                                            content: req.param("submission"),
                                            correct: false,
                                            time: moment(),
                                        }, { w: 1 }, function(e, d) {
                                            if (e) {
                                                console.dir(e);
                                                result.ret = -4;
                                            }
                                            res.send(result);
                                        });
                                    }
                                    break;
                                }
                            }
                        });
                    } else {
                        result.ret = -2;
                        res.send(result);
                    }
                } else {
                    result.ret = -1;
                    res.send(result);
                }
            } else {
                result.ret = -1;
                res.send(result);
            }
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
                            res.send(result);
                        } else {
                            // console.dir(d);
                            result.ret = 1;
                            sendgrid.send({
                                to:       req.param("email"),
                                from:     'michael@easyctf.com',
                                fromname: "Michael Zhang",
                                replyto: "failed.down@gmail.com",
                                subject:  'Password reset requested.',
                                html:     '<p>Hey there</p><p>Someone (hopefully you) requested to change the password for the account with the email ' + req.param('email') + '. Obviously, we\'ll be asking for verification of identity, so if you did in fact request this, follow this link: http://easyctf.com/forgot/' + code + "</p><p>Michael Zhang<br />EasyCTF</p>"
                            }, function(err, json) {
                                if (err) {
                                    result.ret = -3;
                                    res.send(result);
                                } else {
                                    result.ret = 1;
                                    res.send(result);
                                }
                            });
                        }
                    });
                });
            } else {
                result.ret = -2;
                res.send(result);
            }
        });
    });

    app.get("/forgot/:code", function(req, res) {
        render(req, res, "verify", "Reset Password - EasyCTF 2014", {
            code: req.params.code,
        });
    });

    app.post("/reset-password", function(req, res) {
        var result = {};
        if (req.param("p1") == req.param("p2")) {
            db.collection("reset_password").find({
                code: req.param("code"),
            }).toArray(function(e, d) {
                if (e) { console.dir(e); }
                else {
                    if (d.length == 1) {
                        var obj = d[0];
                        var now = moment();
                        var exp = moment(obj.expire._d);
                        if (now.isBefore(exp) && obj.active) {
                            var salt = generateSalt();
                            var pass = req.param("p1");
                            var salted = salt + md5(pass + salt);
                            db.collection("reset_password").update({
                                code: req.param("code")
                            }, {
                                $set: {
                                    active: false,
                                }
                            }, function(e, d) {
                                if (e) {
                                    result.ret = -3;
                                    res.send(result);
                                } else {
                                    db.collection("accounts").update({
                                        email: obj.email,
                                    }, {
                                        $set: {
                                            pass: salted,
                                        }
                                    }, function(e, d) {
                                        if (e) {
                                            result.ret = -3;
                                            res.send(result);
                                        }
                                        else {
                                            result.ret = 1;
                                            res.send(result);
                                        }
                                    });
                                }
                            });
                        } else {
                            result.ret = -4;
                            res.send(result);
                        }
                    } else {
                        result.ret = -2;
                        res.send(result);
                    }
                }
            });
        } else {
            result.ret = -1;
            res.send(result);
        }
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
    var query = db.collection("accounts").find().sort([['pointDisplay', -1]]);
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

var getSolved = function(req, callback) {
    callback(req.session.user.solved);
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

var getProblem = function(pID, callback) {
    getProblems(function(problems) {
        for(var i=0;i<problems.length;i++) {
            if (problems[i]._id.toString() === pID.toString()) {
                callback(problems[i]);
            }
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