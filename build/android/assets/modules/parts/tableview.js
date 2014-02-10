exports.create = function() {
	return Ti.UI.createTableView({
		top : Ti.Platform.displayCaps.platformWidth / 8,
		backgroundColor : 'transparent'
	});
};