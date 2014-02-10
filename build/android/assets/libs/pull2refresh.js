exports.create = function(_view, _options, _callback) {
	var self = _view;
	var offset = 0;
	self.actind = require('modules/parts/actind').create('Aktualisiere die Videoliste …');
	self.add(self.actind);
	var options = {
		arrow : _options.arrow || '/assets/whiteArrow.png',
		text : _options.text || "Ziehe um zu  aktualisieren",
		statustext : _options.statustext || 'Aktualisiere Videoliste',
		statustext1 : _options.statustext1 || 'Ziehe runter!',
		statustext2 : _options.statustext2 || 'Lass los!',
	};
	var tableHeader = Ti.UI.createView({
		backgroundColor : 'black',
		width : Ti.Platform.displayCaps.platformWidth - 1,
		height : 140,
		backgroundImage:'/assets/stiege.jpg'
	});
	var arrow = Ti.UI.createView({
		backgroundImage : options.arrow,
		width : 20,
		height : 30,
		bottom : 6,
		left : 20
	});
	var statusLabel = Ti.UI.createLabel({
		text : options.text,
		left : 55,
		width : 200,
		bottom : 10,
		height : "auto",
		color : "white",
		textAlign : "center",
		font : {
			fontSize : 13,
			fontWeight : "bold"
		},
		shadowColor : "#999",
		shadowOffset : {
			x : 0,
			y : 1
		}
	});
	var lastUpdatedLabel = Ti.UI.createLabel({
		text : "",
		left : 55,
		width : 220,
		bottom : 15,
		height : "auto",
		color : "#576c89",
		textAlign : "center",
		font : {
			fontSize : 12
		},
		shadowColor : "#999",
		shadowOffset : {
			x : 0,
			y : 1
		}
	});
	var actInd = Ti.UI.createActivityIndicator({
		left : 20,
		bottom : 13,
		width : 30,
		height : 30
	});
	tableHeader.add(arrow);
	tableHeader.add(statusLabel);
	tableHeader.add(actInd);
	self.headerPullView = tableHeader;

	var pulling = false;
	var reloading = false;

	function beginReloading() {
		_callback();
		actInd.show();
		setTimeout(function() {
			self.actind.show();
			reloading = false;
			lastUpdatedLabel.text = "";
			statusLabel.text = options.statustext1;
			actInd.hide();
			arrow.show();
			self.setContentInsets({
				top : 0
			}, {
				animated : true
			});
		}, 700);
	}
	
	self.addEventListener('scroll', function(e) {
		offset = e.contentOffset.y;
		var t;
		if (offset <= -80.0 && !pulling) {
			t = Ti.UI.create2DMatrix();
			t = t.rotate(-180);
			pulling = true;
			arrow.animate({
				transform : t,
				duration : 180
			});
			statusLabel.text = options.statustext2;
		} else if (pulling && offset > -80.0 && offset < 0) {
			pulling = false;
			t = Ti.UI.create2DMatrix();
			arrow.animate({
				transform : t,
				duration : 180
			});
			statusLabel.text = options.statustext1;
		}
	});
	self.addEventListener('dragEnd', function(e) {
		if (!reloading && pulling && offset <-80) {
			reloading = true;
			pulling = false;
			arrow.hide();
			statusLabel.text = options.statustext;
			self.setContentInsets({
				top : 60
			}, {
				animated : true
			});
			arrow.transform = Ti.UI.create2DMatrix();
			beginReloading();
		}
	});

};
