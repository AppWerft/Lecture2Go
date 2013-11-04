exports.create = function(_args) {
	var w = Ti.Platform.displayCaps.platformWidth;
	var self = Ti.UI.createWindow({
		navBarHidden : true,
		backgroundColor : (Ti.Platform.name == 'android') ? '#333' : Ti.UI.iOS.COLOR_SCROLLVIEW_BACKGROUND,
		layout : (_args.layout) ? _args.layout : null,
		orientationModes : [Ti.UI.PORTRAIT,Ti.UI.UPSIDE_PORTRAIT]
	});

	self.navbar = Ti.UI.createView({
		width : w,
		height : w / 6,
		backgroundColor : '#eee'
	});
	/*if (Ti.Platform.name == 'android')
		self.navbar.bottom = 0
	else*/
		self.navbar.top = 0
	self.navbar.add(Ti.UI.createImageView({
		top : 0,
		left : 0,
		image : (_args.back) ? '/assets/redquadwitharrow.png' : '/assets/redquad.png',
		height : w / 6,
		width : w / 6
	}));
	if (_args.rightnavi) {
		self.navbar.add(_args.rightnavi);
		_args.rightnavi.right = 0;
		_args.rightnavi.width = w / 3;
		_args.rightnavi.height = w / 6;
		_args.rightnavi.addEventListener('click', function() {
			if (_args.rightnavi.menue.active === false) {
				_args.rightnavi.menue.animate({
					transform : Ti.UI.create2DMatrix({
						scale : 1,
						duration : 1700
					})
				});
				_args.rightnavi.menue.active = true;
			} else {
				_args.rightnavi.menue.animate({
					transform : Ti.UI.create2DMatrix({
						scale : 0.001,
						duration : 1700
					})
				});
				_args.rightnavi.menue.active = false;
			}
		});
	}
	self.navbar.add(Ti.UI.createView({
		bottom : 0,
		height : w / 150,
		backgroundColor : 'black'
	}));
	self.navtitle = Ti.UI.createLabel({
		width : Ti.UI.FILL,
		text : _args.title,
		left : w / 5,
		right : w / 5,
		height : w / 8,
		font : {
			fontWeight : 'bold',
			fontSize : w / 20,
			fontFamily : 'TheSans-B6SemiBold'
		},
		color : 'black',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
	});
	self.add(self.navbar);

	self.navbar.add(self.navtitle);
	if (_args.back) {
		self.navbar.addEventListener('click', function(e) {
			if (e.x > w / 2)
				return;
			try {
				self.close({
					animated : true
				});
			} catch(E) {
			}
		});
	}
	self.addEventListener('blur', function(_e) {
		if (_args.rightnavi && _args.rightnavi.menue && _args.rightnavi.menue.active) {
			_args.rightnavi.menue.transform = Ti.UI.create2DMatrix({
				scale : 0.01
			});
			_args.rightnavi.menue.active = false;
		}
	})
	if (_args.message)
		self.add(require('modules/parts/actind').create(_args.message));
	return self;
}
