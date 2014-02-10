exports.create = function(_item, _window, _callback) {
	var RATIO = 16 / 9;
	var self = Ti.Media.createVideoPlayer({
		width : Ti.UI.FILL,
		height : Ti.Platform.displayCaps.platformWidth / RATIO,
		allowsAirPlay : true,
		autoplay : true,
		opacity : 1,
		backgroundImage : _item.image,
		url : _item.mp4,
		top : 0,
		mediaControlStyle : Ti.Media.VIDEO_CONTROL_DEFAULT,
		scalingMode : Ti.Media.VIDEO_SCALING_ASPECT_FIT
	});
	self.play();
	self.addEventListener('playbackstate', function(_e) {
		switch (_e.playbackState) {
			case Ti.Media.VIDEO_PLAYBACK_STATE_PLAYING :
				_callback('hide');
				Ti.App.Model.setRecentMovie(_item);
				break;
			case Ti.Media.VIDEO_PLAYBACK_STATE_INTERRUPTED :
			case Ti.Media.VIDEO_PLAYBACK_STATE_PAUSED :
			case Ti.Media.VIDEO_PLAYBACK_STATE_STOPPED :
				_callback('show');
				break;
		}

	});

	self.addEventListener('fullscreen', function(_e) {
		switch (_e.entering) {
			case true:
				_window.setOrientationModes([Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT]);
				break;
			case false:
				_window.setOrientationModes([Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]);
				break;
		}
	});
	return self;
};

