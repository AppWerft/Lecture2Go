exports.create = function(title) {
	var self = require('/modules/l2g').create(title);
	self.map = Ti.Map.createView({
		region : {
			latitude : 53.5668347,
			longitude : 9.9847269,
			latitudeDelta : 0.009,
			longitudeDelta : 0.009
		},
		mapType : Ti.Map.HYBRID_TYPE
	});
	self.add(self.map);
	self.map.addEventListener('click', function(e) {
		console.log(e.clicksource);
		if (e.clicksource == 'rightButton') {
			var win = require('modules/l2g').create({
				back : true,
				title : e.annotation.title
			});
			var streetWeb = Ti.UI.createWebView({
				url : '/streetview.html',
				width : Ti.UI.FILL,
				height : Ti.UI.FILL,
				top : 40,
				disableBouncing : true
			});
			var script = 'initSV({"lat" : ' + e.annotation.latitude + ', "lng" : ' + e.annotation.longitude + '});';
			console.log(script);
			streetWeb.addEventListener('load', function(e) {
				streetWeb.evalJS(script);
			});

			win.add(streetWeb);
			self.tab.open(win);
		}
	});
	Ti.include('modules/campusnavigator/data.js');
	self.addEventListener('focus', function() {
		if (self.pinadded)
			return;
		var pins = [], i = 0;
		for (var p in PIN) {
			var id = PIN[p].IDS[0];
			var total = PIN[p].IDS.length;
			if (LOC[id] && LOC[id].TIT && total && PIN[p].LAT < 90 && PIN[p].LON < 180) {
				var title = LOC[id].TIT;
				var options = {
					latitude : PIN[p].LAT,
					longitude : PIN[p].LON,
					animate : true,
					rightButton : Ti.UI.iPhone.SystemButton.DISCLOSURE,
					ids : PIN[p].IDS,
					title : title,
					subtitle : (total > 1) ? 'mehrere Einträge' : ''
				};
				console.log(options);
				var pin = Ti.Map.createAnnotation(options);
				console.log(pin);
				self.map.addAnnotation(pin);
				i++;
			}
		}
		self.pinadded = true;
	});
	return self;
}
