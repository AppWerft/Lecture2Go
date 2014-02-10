exports.create = function(_item) {
	var self = Ti.UI.createView({
		height : 25,
		backgroundColor : '#aaa',
	});
	self.add(Ti.UI.createLabel({
		left : 40,
		text : _item.title,
		color : 'white',
		width : Ti.UI.FILL,
		font : {
			fontWeight : 'bold',
			fontSize : '18pt'
		},
		shadowOffset : {
			x : 1,
			y : 1
		},
		shadowColor : 'gray'
	}));
	self.add(Ti.UI.createImageView({
		left : 10,
		image : _item.icon,
		height : 20,
		width : 20
	}));
	return self;
};