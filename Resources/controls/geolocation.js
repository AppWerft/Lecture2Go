exports.get = function(_args, _callback) {
	if (!Ti.Geolocation.locationServicesEnabled)
		_callback(null);
	Ti.Geolocation.getCurrentPosition(function(_e) {
		if (_e.success) {
			_callback(_e.coords);
		} else
			_callback(null);
	});
};
