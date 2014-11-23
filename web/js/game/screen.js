var Screens = {
	Splash: {
		name: "Splash",
		draw: function(ctx) {
			ctx.drawImage(imgs.splash, 0, 0, 840, 480);
		},
		update: function(time) {

		},
		click: function(e) {
			SwitchScreen("Menu");
		}
	},
	Menu: {
		name: "Menu",
		draw: function(ctx) {
			console.log("MENU TIME NOW");
		},
		update: function(time) {

		},
		click: function(e) {

		}
	}
};

var CurrentScreen = "";
var SwitchScreen = function(New) {
	if (CurrentScreen in Screens) canvas.removeEventListener("click", Screens[CurrentScreen].click);
	CurrentScreen = New;
	canvas.addEventListener("click", Screens[CurrentScreen].click);
}

console.log("screen.js");