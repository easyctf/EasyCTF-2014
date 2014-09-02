var express = require('express');
var router = express.Router();

var randomString = function(length) {
	var str = "";
	var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
	for(var i=0; i<length; i++) {
		str += charset.charAt(Math.floor(Math.random()*charset.length));
	}
	return str;
};
var htmlEntities = function(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};
var validateEmail = function(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

router.get('/', function(req, res) {
	res.render('index', { title: 'EasyCTF' });
});
router.get('/login', function(req, res) {
	res.render('login', { title: 'Login - EasyCTF' });
});
router.get('/register', function(req, res) {
	res.render('register', { title: 'Register - EasyCTF' });
});

router.post('/login.ajax', function(req, res) {
	res.send('hi');
});
router.post('/register.ajax', function(req, res) {
	var result = {};
	var errors = [];
	
	var teamname = htmlEntities(req.body.team_name.trim());
	var email = req.body.email;
	var password = req.body.password;
	var school = htmlEntities(req.body.school.trim());
	
	var phash = "";
	
	if (!validateEmail(email)) {
		errors.push("Email address is not valid.");
	}
	if (teamname.length < 1) {
		errors.push("Team name must not be empty.");
	}
	if (school.length < 1) {
		errors.push("School must not be empty.");
	}
	if (password.length < 6) {
		errors.push("Password must be at least 6 characters long.");
	}
	
	if (errors.length == 0) {
		var MongoClient = require('mongodb').MongoClient, format = require('util').format;
		MongoClient.connect('mongodb://github_user:__temporarypassword__@kahana.mongohq.com:10071/app29067833', function (err, db) {
			if (err) {
				throw err;
			} else {
			}
			db.close();
		});
	}
	
	if (errors.length == 0) {
		result.message = "<p>You have registered successfully!</p>";
	} else {
		result.message = "<p>You need to recheck the following items:</p><ul>";
		for(var i=0;i<errors.length;i++) {
			result.message += "<li>" + errors[i] + "</li>";
		}
		result.message += "</ul>";
	}
	
	result.errors = errors;
	
	res.send(result);
});

module.exports = router;
