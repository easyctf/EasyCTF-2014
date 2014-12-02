var pg = require("pg");
var exec = require("child_process").exec;
var fs = require("fs");
var crypto = require("crypto");
var moment = require("moment");
var mysql = require("mysql");

/*
var params = {
	host: 'ec2-54-204-40-96.compute-1.amazonaws.com',
	user: 'uuauqvjvjlhsjj',
	password: 'ey2ywt2B5LTxh1Tvsxc2QYKlmT',
	port: 5432,
	database: 'd1r3e9shr2fbgn',
	ssl: true
};

var connection = "postgres://" + params.user + ":" + params.password + "@" + params.host + ":" + params.port + "/" + params.database + "?ssl=true";
*/

var params = {
	host: "us-cdbr-iron-east-01.cleardb.net",
	user: "b1b745e3a0348c",
	password: "46cc7908",
	database: "heroku_771c330721efe5a"
};

module.exports = function(app) {
	app.get(["/sites/cookiezi", "/sites/cookiezi/", "/sites/cookiezi/index.php"], function(req, res) {
	res.cookie('flag', 'osu_is_love_osu_is_l1fe');
	res.render("sites/cookiezi/index");
	});

	app.get(["/sites/post-it", "/sites/post-it/", "/sites/post-it/index.php"], function(req, res) {
	res.render("sites/post-it/index");
	});

	app.post(["/sites/post-it", "/sites/post-it/", "/sites/post-it/index.php"], function(req, res) {
		if (req.param("user") == "admin" && req.param("request") == "flag") {
			res.send("flag: p0st_is_moar_secure_than_g3t");
		} else {
			res.render("sites/post-it/index");
		}
	});

	app.get(["/sites/injection", "/sites/injection/", "/sites/injection/index.php"], function(req, res) {
	res.render("sites/injection/index");
	});

	app.post(["/sites/injection", "/sites/injection/", "/sites/injection/index.php"], function(req, res) {
		var unclean = function(string) {
			var words = ["select", "insert", "union", "drop", "create", "describe", "table", "from", "where", "count", "now", "distinct", "flush", "into", "destroy"];
			for(var i=0;i<words.length;i++) {
				if (string.toLowerCase().indexOf(words[i].toLowerCase()) > -1) {
					return true;
				}
			}
			return false;
		};

		if (!(req.param("username") && req.param("password"))) {
			res.render("sites/injection/index", {
				posted: true,
				error: true
			});
			return;
		}

		if (unclean(req.param("username")) || unclean(req.param("password"))) {
			res.render("sites/injection/index", {
				posted: true,
				error: true
			});
			return;
		} else {
			var connection = mysql.createConnection(params);
			connection.connect();
			var queryString = "SELECT * FROM `users-2875980287301982374` WHERE username='" + req.param("username") + "' AND password='" + req.param("password") + "'";
			// console.log(queryString);
			connection.query(queryString, function(err, rows, fields) {
				if (err) {
					console.dir(err);
					res.render("sites/injection/index", {
						posted: true,
						error: true
					});
					return;
				}
				res.render("sites/injection/index", {
					posted: true,
					error: rows ? false : true,
					users: rows
				});
				return;
				// console.dir(rows);
				// console.dir(fields);
			});
			connection.end();/*
			pg.connect(connection, function(err, client, done) {
				if (err) {
					res.render("sites/injection/index", {
						posted: true,
						error: true
					});
					return;
				} else {
					/*
					client.query("SELECT * FROM \"users-2875980287301982374\" WHERE username='" + req.param("username") + "' AND password='" + req.param("password") + "'", function(err, result) {
						if (err) {
							res.render("sites/injection/index", {
								posted: true,
								error: true
							});
							return;
						} else {
							users = result.rows;
							res.render("sites/injection/index", {
								posted: true,
								error: users ? false : true,
								users: users
							});
							return;
						}
					});
				}
			}); */
		}
	});

	app.get(["/sites/pointless-keys", "/sites/pointless-keys/", "/sites/pointless-keys/index.php"], function(req, res) {
		res.render("sites/pointless-keys/index");
	});

	app.post(["/sites/pointless-keys/flag.php"], function(req, res) {
		var a = req.param("target").join(",");
		var b = req.param("keys").join(",");
		if (b.indexOf(a) >= 0) {
			res.send("flag is konami_c0dez");
		}
	});

	app.get(["/sites/what", "/sites/what/", "/sites/what/index.php"], function(req, res) {
		res.render("sites/what/index", { result: "select a file" });
	});

	app.post(["/sites/what", "/sites/what/", "/sites/what/index.php"], function(req, res) {
		console.dir(req.files);
		if (req.files.file) {
			fs.readFile(req.files.file.path, function(err, data) {
				var nPath = __dirname + "/uploaded/what/" + moment().format();
				exec("g++ src/what/what/what.cpp -o bin/what/what && ./bin/what/what "+req.files.file.path, function(err, stdout, stderr) {
					var result = err || (stderr || stdout);
					res.render("sites/what/index", { result: result });
				});
				/*
				fs.writeFile(nPath, data, function(err) {
					console.log("yey copied to "+nPath);
				});
				*/
			});
		}
	});
};

function checksum (str, algorithm, encoding) {
	return crypto.createHash(algorithm || 'md5').update(str, 'utf8').digest(encoding || 'hex');
}
