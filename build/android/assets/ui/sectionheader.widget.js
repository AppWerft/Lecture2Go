exports.create = function(label) {
	var self = Ti.UI.createView({
		backgroundColor : '#F17B0D',
		height : Ti.UI.SIZE
	});
	self.add(Ti.UI.createLabel({
		width : Ti.UI.FILL,
		left : '10dp',
		top : '2dp',
		bottom : '2dp',
		text : label,
		font : {
			fontSize : '12dp'
		},
		color : 'black'
	}));
	return self;
}; 