exports.create = function(type,title) {
	var w = Ti.Platform.displayCaps.platformWidth;
	var view = Ti.UI.createView({
		backgroundColor : 'gray',
		height : w / 16
	});
	view.add(Ti.UI.createLabel({
		text : title,
		left : 5,
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		color : 'white',
		font : {
			fontSize : w / 25,
			fontFamily : 'TheSans-B6SemiBold'
		}
	}));
	return (Ti.UI.createTableViewSection({
			headerView : view,
			type : type
		}));
};
