exports.create = function() {
	var options = arguments[0] || {};
	var self = Ti.UI.createWindow({
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	});
	self.addEventListener('open', function() {
		if (Ti.Android) {
			var activity = self.getActivity();
			if (activity.actionBar) {
				activity.actionBar.setDisplayHomeAsUp(true);
				if (options.title)
					activity.actionBar.title = options.title;
				if (options.subtitle)
					activity.actionBar.title = options.subtitle;

				activity.actionBar.onHomeIconItemSelected = function() {
					self.close();
				};
			}
		}
	});
	return self;
};
