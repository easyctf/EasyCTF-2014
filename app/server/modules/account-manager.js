var crypto = require("crypto");
var MongoDB = require("mongodb").Db;
var Server = require("mongodb").Server;
var moment = require("moment");

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
var accounts = db.collection("accounts");

exports.addNewAccount = function(newData, callback) {
    accounts.findOne({user: newData.user}, function(e, o) {
        if (o) {
            callback("username-taken");
        } else {
            accounts.findOne({email: newData.email}, function(e, o) {
                if (o) {
                    callback("email-taken");
                } else {
                    saltAndHash(newData.pass, function(hash){
                        newData.pass = hash;
                        newData.date = moment().format("MMMM Do YYYY, h:mm:ss a");
                        accounts.insert(newData, { safe: true }, callback);
                    });
                }
            });
        }
    });
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

var md5 = function(str) {
    return crypto.createHash('md5').update(str).digest('hex');
};

var saltAndHash = function(pass, callback) {
    var salt = generateSalt();
    callback(salt+md5(pass+salt));
};