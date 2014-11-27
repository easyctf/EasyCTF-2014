var _LOADED = -1;
var images = [];
var imageDir = "img/singularity/";
var imageURLs = [
	"cs_room_computer.png",
	"cs_room_floor.png",
	"cs_room_table.png",
	"floor.png",
	"grass.png",
	"main_char_front_1.png",
	"main_char_front_2.png",
	"main_char_front_3.png",
	"main_char_leftside_1.png",
	"main_char_leftside_2.png",
	"main_char_leftside_3.png",
	"main_char_side_1.png",
	"main_char_side_2.png",
	"main_char_side_3.png",
	"road.png",
	"road_connector_1.png",
	"road_connector_2.png",
	"road_connector_3.png",
	"road_connector_4.png",
	"road2.png",
	"robot.png",
	"robot_big.png",
	"robot_very_large.png"
];

var screens = [
];

for(var i=0; i<imageURLs.length; i++) {
	console.log(i+"\t"+imageURLs[i]);
}

var imageLoaded = function() {
	images.push(this);
	_LOADED += 1;
	if (_LOADED < imageURLs.length) {
		var tImage = new Image();
		tImage.onload = imageLoaded;
		tImage.src = imageDir + imageURLs[_LOADED];
	} else {
		init();
	}
};

var imageLoader = function() {
	_LOADED = 0;
	var tImage = new Image();
	tImage.onload = imageLoaded;
	tImage.src = imageDir + imageURLs[_LOADED];
};

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = function() {
		return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(e, t) {
			window.setTimeout(e, 1e3 / 60)
		}
	}()
}

var tiles = [];
var inta = Date.now();

var lt = 0, nd = 0, cd = 0, kd = 0, ld = 0;

var Player = function() {
	this.x = 0;
	this.y = 0;
}

var fillArr = function(w, h, id) {
	for(var i=0; i<w*h; i++) {
		tiles[i] = id;
	}
}

var anim = function() {
	requestAnimationFrame(anim);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	nd = Math.floor(Date.now()/200);

	for(var y=0; y<24; y++) {
		for(var x=0; x<42; x++) {
			ctx.drawImage(images[tiles[y*42 + x]], x*20, y*20);
		}
	}
}

var testBackground = function() {
	fillArr(42, 24, 3);
}

var ev;
var canvasClick = function(e) {
	ev = e;
	var x = e.clientX - e.target.offsetLeft;
	var y = e.clientY - e.target.offsetTop;
	var i = Math.floor(x/20) + Math.floor(y/20) * 42;
	arr[i] = (!arr[i]) & 1;
};

var init = function() {
	testBackground();
	canvas.addEventListener("mousedown", canvasClick, false);
	anim();
};

imageLoader(function() {
	init();
});