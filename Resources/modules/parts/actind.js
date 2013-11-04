exports.create = function(title) {
	var style;
	///= Ti.UI.ActivityIndicatorStyle.DARK;
	if (Ti.Platform.name === 'iPhone OS') {
		style = Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN;
	}
	var self = Ti.UI.createActivityIndicator({
		backgroundColor : 'red',
		borderRadius : 8,
		width : 240,
		height : 60,
		color : 'white',
		style : style,
		message : ' ' + title,
		opacity : 0.99,
		zIndex : 999,
		font : {
			fontSize : 13,
			fontFamily : 'TheSans-B6SemiBold'
		},
		borderColor : 'black',
		borderWidth : 2,
	});
	self.show();
	Ti.App.addEventListener('data_ready', function() {
		if (!self)
			return;
		setTimeout(function() {
			self.hide();
		}, 2000);
		//self = null;
	})
	return self;
}
