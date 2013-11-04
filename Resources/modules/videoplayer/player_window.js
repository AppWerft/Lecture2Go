exports.create = function(_args) {
	var RATIO = 16 / 9;
	Ti.UI.orientation = Titanium.UI.LANDSCAPE_LEFT;
	var self = Ti.UI.createWindow({
		navBarHidden : true,
		orientationModes : [Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT]
	});
	self.player = Ti.Media.createVideoPlayer({
		allowsAirPlay : true,
		autoplay : true,
		fullscreen : true,
		url : _args.mp4,
		mediaControlStyle : Ti.Media.VIDEO_CONTROL_DEFAULT,
		scalingMode : Ti.Media.VIDEO_SCALING_ASPECT_FIT
	});
	self.player.play();
	self.add(self.player);
	self.player.addEventListener('fullscreen', function(_e) {
		if (_e.entering == false)
			self.close()
	});
	self.player.addEventListener('complete', function(_e) {
		self.close()
		self = null;
	});
	self.player.addEventListener('playbackstate', function(_e) {
		switch (_e.playbackState) {
			case Ti.Media.VIDEO_PLAYBACK_STATE_PLAYING :
				//_callback('hide');
				//				Ti.App.Model.setRecentMovie(_item);
				break;
			case Ti.Media.VIDEO_PLAYBACK_STATE_INTERRUPTED :
			case Ti.Media.VIDEO_PLAYBACK_STATE_PAUSED :
			case Ti.Media.VIDEO_PLAYBACK_STATE_STOPPED :
				//	_callback('show');
				break;
		}

	});
	return self;
};

