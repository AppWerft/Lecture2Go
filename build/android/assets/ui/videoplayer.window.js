exports.create = function(_video) {
	var self = require('modules/l2g').create({
		title : _video.title,
		back : false,
	});
	self.backgroundColor = 'white';
	var poster = Ti.UI.createImageView({
		image : _video.image,
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE
	});
	self.add(poster);
	poster.add(Ti.UI.createImageView({
		image : '/assets/play.png',
		width : '50dp',
		height : '50dp'
	}));
	poster.addEventListener('click', function(_e) {
		self.orientationModes = [Ti.UI.LANDSCAPE_RIGHT, Ti.UI.LANDSCAPE_LEFT];
		var activeMovie = Ti.Media.createVideoPlayer({
			autoplay : true,
			fullscreen : true,
			orientationModes : [Ti.UI.LANDSCAPE_RIGHT, Ti.UI.LANDSCAPE_LEFT],
			url : _video.mp4,
			mediaControlStyle : Ti.Media.VIDEO_CONTROL_DEFAULT,
			scalingMode : Ti.Media.VIDEO_SCALING_FIT
		});
		self.add(activeMovie);
	});
	return self;
};
