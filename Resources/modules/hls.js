exports.create = function(_title) {
	self = require('modules/l2g').create(_title);
	self.orientationModes = [Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT];
	self.videoPlayer = Ti.Media.createVideoPlayer({
		autoplay : false,
		fullscreen : true,
		allowsAirPlay : true,
		url : 'http://fms.rrz.uni-hamburg.de:1935/vod/_definst_/mp4:8l2gelbmin/GXGrv5N0BAleqC9b8J3OtQxx.mp4/playlist.m3u8',
		mediaControlStyle : Titanium.Media.VIDEO_CONTROL_DEFAULT,
		scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT
	});

	self.add(self.videoPlayer);
	return self;
}
