var mouse = {x: 0, y: 0};

document.addEventListener('mousemove', function(e){ 
    mouse.x = (e.clientX || e.pageX) - canvas.offsetLeft; 
    mouse.y = (e.clientY || e.pageY) - canvas.offsetTop; 
}, false);

var viewedDialog;

var Screens = {
	Splash: {
		draw: function(ctx) {
			ctx.drawImage(imgs.splash, 0, 0);
		},
		update: function(time) {

		},
		click: function(e) {
			SwitchScreen(Save.New ? "Level1" : "Menu");
		}
	},
	Menu: {
		draw: function(ctx) {

		},
		update: function(time) {
		},
		click: function(e) {

		}
	},
	Level1: {
		levelDialog: [
			{ icon: undefined, name: "", message: "Welcome to EasyCTF! " },
			{ icon: undefined, name: "", message: "" }
		],
		draw: function(ctx) {

		},
		update: function(time) {

		},
		click: function(e) {

		},
		init: function() {
			viewedDialog = false;
		}
	}
};

var CurrentScreen = "";
var SwitchScreen = function(New) {
	if (CurrentScreen in Screens) canvas.removeEventListener("click", Screens[CurrentScreen].click);
	CurrentScreen = New;
	canvas.addEventListener("click", Screens[CurrentScreen].click);
	if (Screens[CurrentScreen].init) Screens[CurrentScreen].init();
}

console.log("screen.js");