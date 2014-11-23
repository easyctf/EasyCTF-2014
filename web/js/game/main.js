var jsdir = "js/game/";
var Game = {};
var oldTime;

$.when(
	$.getScript(jsdir + "loader.js"),
	$.getScript(jsdir + "save.js"),
	$.getScript(jsdir + "canvas.js"),
	$.getScript(jsdir + "screen.js"),
	$.getScript(jsdir + "run.js")
).done(function() {
	SwitchScreen("Splash");
	console.log("main.js");
	oldTime = Date.now();
	frame();
});