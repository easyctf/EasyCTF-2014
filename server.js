/*
var express = require('express')
    , morgan = require('morgan')
    , bodyParser = require('body-parser')
    , methodOverride = require('method-override')
    , app = express()
    , port = process.env.PORT || 3000
    , router = express.Router();

app.use(express.static(__dirname + '/views')); // set the static files location for the static html
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                     // log every request to the console
app.use(bodyParser());                      // pull information from html in POST
app.use(methodOverride());                  // simulate DELETE and PUT

router.get('/', function(req, res, next) {
    res.render('index.html');
});

app.use('/', router);

app.listen(port);
console.log('App running on port', port);
*/

var express = require("express");
var http = require("http");
var app = express();

app.configure(function() {
	app.set("port", process.env.PORT || 3000);
	app.set("views", __dirname + "/app/server/views");
	app.set("view engine", "jade");
	app.locals.pretty = true;
	
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({
		secret: "lol-this-is-such-a-secret",
	}));
	app.use(express.methodOverride());
	app.use(require("stylus").middleware({
		src: __dirname + "/app/public",
	}));
	app.use(express.static(__dirname + "/app/public"));
});

app.configure("development", function() {
	app.use(express.errorHandler());
});

require("./app/server/router")(app);

http.createServer(app).listen(app.get("port"), function() {
	console.log("listening on port " + app.get("port"));
});