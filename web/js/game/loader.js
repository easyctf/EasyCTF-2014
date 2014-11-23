var imgDir = "img/singularity/";
var ext = ".png";
var imgs = {};
var imgURLList = [
	"cs_room_computer",
	"cs_room_floor",
	"cs_room_table",
	"floor",
	"grass",
	"main_char_front_1",
	"main_char_front_2",
	"main_char_front_3",
	"main_char_leftside_1",
	"main_char_leftside_2",
	"main_char_leftside_3",
	"main_char_side_1",
	"main_char_side_2",
	"main_char_side_3",
	"road",
	"road_connector_1",
	"road_connector_2",
	"road_connector_3",
	"road_connector_4",
	"road2",
	"robot",
	"robot_big",
	"robot_very_large",
	"splash"
];
var imagesLoaded = false;

function imgLoaded()
{
	imgs[imgURLList[_LOADID]] = this;
	_LOADID++;
	if(_LOADID<imgURLList.length)
	{
		var timg=new Image();
		timg.onload=imgLoaded;
		timg.src=imgDir+imgURLList[_LOADID]+ext;
	} else {
		console.log("Images are loaded!");
		imagesLoaded = true;
	}
}
function imgLoader()
{
	_LOADID=0;
	var timg=new Image();
	timg.onload=imgLoaded;
	timg.src=imgDir+imgURLList[_LOADID]+ext;
}

imgLoader();