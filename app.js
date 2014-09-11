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
        secret: "lol-this-is-a-secret"
    }));
    app.use(express.methodOverride());
    app.use(require("stylus").middleware({
        src: __dirname + "/app/public"
    }));
    app.use(express.static(__dirname + "/app/public"));
});

app.configure("development", function() {
    app.use(express.errorHandler());
});

require("./app/server/router")(app);

http.createServer(app).listen(app.get("port"), function() {
    console.log("listening...");
});