var frame = function() {
	var now = Date.now();
	var dt = now - oldTime;
	oldTime = now;

	if (imagesLoaded) {
		Screens[CurrentScreen].draw(context);
	}

	requestAnimationFrame(frame);
}