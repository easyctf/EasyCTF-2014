var mouse = {x: 0, y: 0};

document.addEventListener('mousemove', function(e){ 
    mouse.x = (e.clientX || e.pageX) - canvas.offsetLeft; 
    mouse.y = (e.clientY || e.pageY) - canvas.offsetTop; 
}, false);

var Screens = {
	Splash: {
		name: "Splash",
		draw: function(ctx) {
			ctx.drawImage(imgs.splash, 0, 0);
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