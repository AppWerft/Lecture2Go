Ti.Map = require('ti.map');

exports.create = function() {
	var options = arguments[0] || {};
	var ready = false;
	var pins = [];
	var self = require('modules/l2g').create();
	self.mapview = Ti.Map.createView({
		mapType : Ti.Map.TERRAIN_TYPE,
		region : {
			latitude : 53.5629642,
			longitude : 9.9884247,
			latitudeDelta : 0.7,
			longitudeDelta : 0.7,
			enableZoomControls : false
		},
		animate : true,
		regionFit : true,
		userLocation : true
	});
	self.mapview.addEventListener('complete', function() {
	});
	self.addEventListener('focus', function() {
		if (!ready) {
			self.add(self.mapview);
			ready = true;
		}
		Ti.App.Apiomat.getAllWatchedVideos(undefined, {
			onload : function(_data) {
				var pindata;
				while ( pindata = _data.pop()) {
					var annotation = Ti.Map.createAnnotation({
						latitude : pindata.latitude,
						longitude : pindata.longitude,
						title : pindata.title,
						subtitle : pindata.devicename,
						pincolor : Ti.Map.ANNOTATION_RED
					});
					pins.push(annotation);
				}
				Ti.UI.createNotification({
					message : pins.length + ' aktive Nutzer'
				}).show();
				self.mapview.addAnnotations(pins);
			}
		});
	});
	self.addEventListener('blur', function() {
		self.mapview.removeAllAnnotations(pins);
		//	self.remove(self.mapview);
	});

	return self;

};

