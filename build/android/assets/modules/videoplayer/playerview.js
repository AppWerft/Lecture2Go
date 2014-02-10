exports.create = function(_video) {
	var RATIO = 16 / 9;
	var w = Ti.Platform.displayCaps.platformWidth;
	var self = Ti.UI.createView({
		video : _video,
		layout : 'vertical'
	});
	self.preview = Ti.UI.createView({
		top : 0,
		width : Ti.UI.FILL,
		height : w / RATIO,
		backgroundImage : _video.image,
		defaultImage : '/assets/dummy.png'
	});
	var triangle = Ti.UI.createImageView({
		image : '/assets/play.png',
		width : w / 7,
		opacity : 0.6
	});
	self.add(self.preview);
	self.preview.addEventListener('click', function() {
		self.preview.add(require('modules/videoplayer/playerwidget').create(_video, self, function(_e) {
			if (_e == 'hide')
				self.meta.hide();
			else
				self.meta.show();
		}));
	});

	self.meta = Ti.UI.createView({
		backgroundColor : 'gray',
		top : -w / 6,
		opacity : 0.7,
		layout : 'vertical',
		height : w / 6,
		width : Ti.UI.FILL
	});
	self.meta.add(Ti.UI.createLabel({
		width : Ti.UI.FILL,
		color : 'white',
		text : _video.author,
		left : w / 30,
		top : w / 30,
		font : {
			fontSize : w / 20,
			fontFamily : 'TheSans-B6SemiBold'
		}
	}));
	self.meta.add(Ti.UI.createLabel({
		width : Ti.UI.FILL,
		left : w / 30,
		font : {
			fontSize : w / 25,
			fontFamily : 'TheSans-B6SemiBold'
		},
		color : '#ddd',
		text : _video.title
	}));

	self.add(self.meta);

	self.chapter = Ti.UI.createTableView({
		top : 0,
		bubbleParent : false
	});
	self.add(self.chapter);
	setTimeout(function() {
		self.preview.add(triangle);
	}, 200);
	return self;
};
