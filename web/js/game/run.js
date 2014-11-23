var frame = function() {
	var now = Date.now();
	var dt = now - oldTime;
	oldTime = now;

	console.log(CurrentScreen);

	if (imagesLoaded && saveLoaded) {
		Screens[CurrentScreen].update(dt);
		Screens[CurrentScreen].draw(context);
	} else {
	}

	requestAnimationFrame(frame);
}