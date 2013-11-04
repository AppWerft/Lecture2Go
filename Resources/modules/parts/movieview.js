exports.create = function(_video, _i) {
	var w = Ti.Platform.displayCaps.platformWidth;
	var self = Ti.UI.createView({
		width : 280,
		height : 240,
		video : _video,
		backgroundColor : '#333',
		borderRadius : 3,
		borderWidth : 1,
		borderColor : 'black',
	});
	self.add(Ti.UI.createLabel({
		color : '#ccc',
		text : _video.channel.name,
		left : w / 50,
		font : {
			fontSize : w / 22,
			fontFamily : 'TheSans-B6SemiBold'
		},
		width : Ti.UI.FILL,
		height : w / 10,
		top : 5,
		bottom:5
	}));
    console.log(_video);
	self.add(Ti.UI.createImageView({
		image : _video.image,
		width : _video.ratio*140,
		height : 140,
		top : w/7
	}));

	console.log(_video);
	/*if (_video.author) {
	 self.add(Ti.UI.createLabel({
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
	 }*/
	self.add(Ti.UI.createLabel({
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
		top : 140 + w / 10,

	}));

	return self;
}
