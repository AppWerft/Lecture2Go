Ti.Map = require('ti.map');

exports.create = function() {
	var options = arguments[0] || {};
	var ready = false;
	var pins = [];
	var self = require('modules/l2g').create();
	self.mapview = Ti.Map.createView({
		mapType : Ti.Map.TERRAIN_TYPE,
		enableZoomControls : false,
		region : {
			latitude : 53.5629642,
			longitude : 9.9884247,
			latitudeDelta : 0.7,
			longitudeDelta : 0.7

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
				pins = [];
				while ( pindata = _data.pop()) {
					var annotation = Ti.Map.createAnnotation({
						latitude : pindata.latitude,
						longitude : pindata.longitude,
						rightView : Ti.UI.createImageView({
							width : 40,
							height : 30,
							image : pindata.thumb
						}),
						title : pindata.title,
						subtitle : pindata.devicename,
						pincolor : Ti.Map.ANNOTATION_RED,
						videoid : pindata.videoid
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
	var fotobutton = Ti.UI.createImageView({
		bottom : 5,
		right : 0,
		width : 120,
		height : 120,
		zIndex : 999,
		image : '/assets/rainer.png'
	});
	self.mapview.add(fotobutton);
	fotobutton.addEventListener('click', require('controls/photocamera'));
	Ti.App.addEventListener('app:newphoto', function(_e) {
		console.log(_e.imageurl);
		fotobutton.image = _e.imageurl;
	});
	self.mapview.addEventListener('click', function(_e) {
		console.log(_e.clicksource);
		if (_e.annotation && (_e.clicksource == 'rightPane' || _e.clicksource == 'title' || _e.clicksource == 'subtitle')) {
			console.log(_e.annotation);
			var videoid = _e.annotation.videoid;
			require('ui/videohomepage/window').create(_e.annotation.videoid).open();
		}
	});
	return self;

};

