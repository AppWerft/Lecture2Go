exports.create = function(_args) {
	console.log(_args);
	const ARROWHEIGHT = 18;
	var right = _args.right || ARROWHEIGHT;
	var anchor = {
		x : 1 - (right / Ti.Platform.displayCaps.platformWidth),
		y : 0
	};
	var createLi = function(key, item) {
		var li = Ti.UI.createView({
			height : '45dp',
			left : 0,
			bottom : '10dp'
		});
		li.addEventListener('click', function() {
			_args.onclick(key);
		});
		li.add(Ti.UI.createLabel({
			left : '50dp',
			color : 'white',
			text : item.title,
			font : {
				fontSize : '18dp',
				fontWeight : 'bold',
				fontFamily : 'TheSans-B6SemiBold'
			},
		}));
		if (item.icon) {
			li.add(Ti.UI.createImageView({
				image : item.icon,
				left : '10dp',
				width : '26dp',
				height : '26dp'
			}));		}
		if (item.onclick) {
			li.addEventListener('click', item.onclick);
		}
		return li
	}
	var self = Ti.UI.createView({
		zIndex : 999,
		active : false,
		width : Ti.Platform.displayCaps.platformWidth * 0.9,
		top : Ti.Platform.displayCaps.platformWidth * 0.14,
		right : 0,
		transform : Ti.UI.create2DMatrix({
			scale : 0.001
		}),
		anchorPoint : anchor,
		height : Ti.UI.SIZE
	});
	self.container = Ti.UI.createView({
		backgroundColor : '#666',
		bottom : 0,
		top : ARROWHEIGHT,
		height : Ti.UI.SIZE
	});
	self.add(self.container);
	self.add(Ti.UI.createImageView({
		backgroundImage : '/assets/menuearrow.png',
		top : 0,
		right : right,
		height : ARROWHEIGHT,
		width : ARROWHEIGHT
	}));
	var ul = Ti.UI.createView({
		top : ARROWHEIGHT,
		height : Ti.UI.SIZE,
		layout : 'vertical'
	});
	self.container.add(ul);
	for (var key in _args.items) {
		ul.add(createLi(key, _args.items[key]));
	}
	return self;
}
