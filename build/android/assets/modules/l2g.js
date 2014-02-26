exports.create = function(_args) {
	var self = Ti.UI.createWindow({
		fullscreen:true,
		orientationModes : [Ti.UI.PORTRAIT,Ti.UI.UPSIDE_PORTRAIT]
	});
	return self;
};
