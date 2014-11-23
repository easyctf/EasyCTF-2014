var jsdir = "js/game/";
var Game = {};

$.when(
	$.getScript(jsdir + "screen.js")
).done(function() {
	console.log("main.js");
});