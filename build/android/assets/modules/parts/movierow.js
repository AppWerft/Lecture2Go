exports.create = function(_video, _i) {
	var w = Ti.Platform.displayCaps.platformWidth;
	var self = Ti.UI.createTableViewRow({
		hasChild : true,
		height : Ti.UI.FILL,
		selectedBackgroundColor : 'red',
		backgroundColor : (_i % 2 == 0) ? 'white' : '#eee',
		video : _video,
	});
	self.content = Ti.UI.createView({});
	var container = Ti.UI.createView({
		left : w / 3.6,
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE,
		layout : 'vertical',
		top : w / 100,
		bottom : w / 100,
	});
	if (_video.author) {
		container.add(Ti.UI.createLabel({
			color : 'black',
			text : _video.author.replace(/, $/g, ''),
			left : 0,
			font : {
				fontSize : w / 22,
				fontWeight : 'bold',
				fontFamily : 'TheSans-B6SemiBold'
			},
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			top : w / 100,
		}));
	}
	container.add(Ti.UI.createLabel({
		color : '#555',
		text : _video.title,
		left : 0,
		font : {
			fontSize : w / 22,
			fontWeight : 'bold',
			fontFamily : 'TheSans-B6SemiBold'
		},
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE,
		top : w / 100,
		bottom : w / 100,
	}));
	if (/\.jpg$/gi.test(_video.image)) {
		var image = Ti.UI.createImageView({
			image : _video.image,
			width : w / 4,
			left : 0,
			top : 0
		});
		self.content.add(image);
	}
	self.content.add(container);
	if (_video.hits)
		self.content.add(Ti.UI.createLabel({
			color : '#585',
			text : _video.hits,
			right : 0,
			font : {
				fontSize : w / 33,
				fontWeight : 'bold',
				fontFamily : 'TheSans-B6SemiBold'
			},
			width : Ti.UI.FILL,
			bottom : 0
		}));
	return self;
};
